import { useEffect, useRef, useState } from 'react';
import { useRoute } from '../lib/router';
import {
  comparisonURL,
  DEFAULT,
  readRequest,
  type Analysis,
  type Index,
  type Request,
} from './model';
let lastVerifiedRequest: Request | undefined;
export function useAtlas(story = false, active = true) {
  const route = useRoute();
  const initial = useRef(
    story
      ? { request: { ...DEFAULT } }
      : !route.search && lastVerifiedRequest
        ? { request: { ...lastVerifiedRequest } }
        : readRequest(route.search),
  );
  const [request, setRequest] = useState<Request>(initial.current.request),
    [error, setError] = useState(initial.current.error ?? ''),
    [result, setResult] = useState<{ index: Index; analysis: Analysis } | null>(null),
    [pending, setPending] = useState(true),
    [attempt, setAttempt] = useState(0);
  const worker = useRef<Worker | null>(null),
    generation = useRef(0),
    incoming = useRef(route.search);
  const latestRequest = useRef(request);
  latestRequest.current = request;
  const blocked = !active || (!story && !!readRequest(route.search).error);
  useEffect(() => {
    if (blocked) {
      setPending(false);
      return;
    }
    let w: Worker | null = null;
    const timer = setTimeout(() => {
      w = new Worker(new URL('./analysis.worker.ts', import.meta.url), { type: 'module' });
      worker.current = w;
      w.onmessage = (e) => {
        if (e.data.id !== generation.current) return;
        setPending(false);
        if (e.data.error) {
          setError(e.data.error);
          setResult(null);
        } else {
          setError('');
          setResult({ index: e.data.index, analysis: e.data.analysis });
        }
      };
      w.onerror = () => {
        setPending(false);
        setError('The analysis worker could not start. Reload to retry.');
        setResult(null);
      };
      const id = ++generation.current;
      w.postMessage({ id, request: latestRequest.current });
    }, 0);
    return () => {
      clearTimeout(timer);
      w?.terminate();
      worker.current = null;
    };
  }, [attempt, blocked]);
  useEffect(() => {
    if (!story && incoming.current !== route.search) {
      incoming.current = route.search;
      const parsed = readRequest(route.search);
      setRequest(parsed.request);
      setError(parsed.error ?? '');
    }
  }, [route.search, story]);
  useEffect(() => {
    if (blocked) {
      setPending(false);
      return;
    }
    setPending(true);
    const id = ++generation.current;
    worker.current?.postMessage({ id, request });
  }, [request, attempt, blocked]);
  useEffect(() => {
    if (story || !result || pending || error) return;
    lastVerifiedRequest = { ...request };
    const target = comparisonURL(request),
      timer = setTimeout(() => {
        if (location.pathname + location.search !== target) {
          incoming.current = target.slice(target.indexOf('?'));
          route.navigate(target, true);
        }
      }, 140);
    return () => clearTimeout(timer);
  }, [request, result, pending, error, story]);
  const patch = (change: Partial<Request>) => {
    setError('');
    setRequest((p) => ({ ...p, ...change }));
  };
  const reset = () => {
    const target = comparisonURL(DEFAULT);
    incoming.current = target.slice(target.indexOf('?'));
    route.navigate(target, true);
    setError('');
    setRequest({ ...DEFAULT });
    setAttempt((n) => n + 1);
  };
  return {
    request,
    patch,
    result,
    error,
    pending,
    retry: () => {
      setError('');
      setAttempt((n) => n + 1);
    },
    reset,
  };
}
