import {
  createContext,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react';
const current = () => ({ path: location.pathname, search: location.search, hash: location.hash });
const RouteContext = createContext({
  ...current(),
  navigate: (_to: string, _replace = false) => {},
});
export function Router({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState(current);
  useEffect(() => {
    const onPop = () => setRoute(current());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = (to: string, replace = false) => {
    const target = new URL(to, location.origin);
    const changed = target.pathname !== location.pathname;
    history[replace ? 'replaceState' : 'pushState'](
      {},
      '',
      target.pathname + target.search + target.hash,
    );
    setRoute(current());
    if (changed) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('main')?.focus({ preventScroll: true }),
      );
    }
    if (target.hash)
      requestAnimationFrame(() =>
        document.getElementById(target.hash.slice(1))?.scrollIntoView({ behavior: 'instant' }),
      );
  };
  return <RouteContext value={{ ...route, navigate }}>{children}</RouteContext>;
}
export const useRoute = () => useContext(RouteContext);
export function Link({ href = '', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useRoute();
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          !event.defaultPrevented &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey &&
          event.button === 0 &&
          href.startsWith('/')
        ) {
          event.preventDefault();
          navigate(href);
        }
      }}
    />
  );
}
