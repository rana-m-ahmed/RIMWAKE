import { useEffect, useState, lazy, Suspense } from 'react';
import { DataProvider } from './lib/data';
import { SelectionProvider } from './lib/selection';
import { Link, Router, useRoute } from './lib/router';
import { Footer, Header } from './components/Shell';
const Experience = lazy(() => import('./atlas/MissionStory'));
import MissionLoading from './atlas/Loading';
import ObservationLoading from './components/ObservationLoading';
const Observatory = lazy(() => import('./pages/Observatory'));
const MissionPage = lazy(() => import('./atlas/MissionPage'));
const FieldGuide = lazy(() => import('./pages/FieldGuide'));
const Sources = lazy(() => import('./pages/Sources'));
function ExplorerRoute({ legacy }: { legacy: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <MissionLoading />;
  return (
    <Suspense fallback={legacy ? <ObservationLoading /> : <MissionLoading />}>
      {legacy ? <Observatory /> : <MissionPage />}
    </Suspense>
  );
}

function Routes() {
  const route = useRoute();
  const query = new URLSearchParams(route.search);
  const legacy =
    query.get('r') === 'rimwake-p0-20261114-v1' ||
    query.get('legacy') === '1' ||
    ['two-skies-one-instant', 'sunrise-im1'].includes(query.get('case') ?? '');
  useEffect(() => {
    document.title = `RIMWAKE · ${route.path === '/explore' ? 'Mission Atlas' : route.path === '/field-guide' ? 'Field Guide' : route.path === '/sources' ? 'Sources & evidence' : 'The place. The date. The difference.'}`;
    if (route.path === '/' && (route.hash === '#instrument' || route.hash === '#explore'))
      route.navigate('/explore', true);
    if (route.path === '/' && route.hash === '#method') route.navigate('/method', true);
    if (route.path === '/method') route.navigate('/sources' + route.hash, true);
  }, [route.path, route.hash]);
  return (
    <>
      <Header />
      <Suspense
        fallback={
          route.path === '/explore' ? (
            legacy ? (
              <ObservationLoading />
            ) : (
              <MissionLoading />
            )
          ) : (
            <main id="main" style={{ minHeight: '100vh' }} aria-busy="true" />
          )
        }
      >
        {route.path === '/' ? (
          <Experience />
        ) : route.path === '/explore' ? (
          <ExplorerRoute legacy={legacy} />
        ) : route.path === '/field-guide' ? (
          <FieldGuide />
        ) : route.path === '/sources' || route.path === '/method' ? (
          <Sources />
        ) : (
          <main
            id="main"
            tabIndex={-1}
            style={{ padding: '90px 30px', maxWidth: 1000, margin: 'auto' }}
          >
            <p className="eyebrow">ROUTE / NOT FOUND</p>
            <h1 style={{ font: '56px var(--font-display)' }}>A different path.</h1>
            <p>
              This route does not contain an observation. The instrument and its supported samples
              are available below.
            </p>
            <Link href="/explore" className="primaryButton">
              Open the Explorer ↗
            </Link>
          </main>
        )}
      </Suspense>
      <Footer />
    </>
  );
}
export default function App() {
  return (
    <Router>
      <DataProvider>
        <SelectionProvider>
          <Routes />
        </SelectionProvider>
      </DataProvider>
    </Router>
  );
}
