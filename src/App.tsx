import { useEffect } from 'react';
import { DataProvider } from './lib/data';
import { SelectionProvider } from './lib/selection';
import { Link, Router, useRoute } from './lib/router';
import { Footer, Header } from './components/Shell';
import Discover from './pages/Discover';
import Explore from './pages/Explore';
import Method from './pages/Method';

function Routes() {
  const route = useRoute();
  useEffect(() => {
    document.title = `RIMWAKE · ${route.path === '/explore' ? 'One time. Two horizons.' : route.path === '/method' ? 'The method & evidence' : 'Same moment. Different sky.'}`;
    if (route.path === '/' && (route.hash === '#instrument' || route.hash === '#explore'))
      route.navigate('/explore', true);
    if (route.path === '/' && route.hash === '#method') route.navigate('/method', true);
  }, [route.path, route.hash]);
  return (
    <>
      <Header />
      {route.path === '/' ? (
        <Discover />
      ) : route.path === '/explore' ? (
        <Explore />
      ) : route.path === '/method' ? (
        <Method />
      ) : (
        <main
          id="main"
          tabIndex={-1}
          style={{ padding: '90px 30px', maxWidth: 1000, margin: 'auto' }}
        >
          <p className="eyebrow">ROUTE / NOT FOUND</p>
          <h1 style={{ font: '56px var(--font-display)' }}>A different path.</h1>
          <p>
            This route does not contain an observation. The instrument and its supported samples are
            available below.
          </p>
          <Link href="/explore" className="primaryButton">
            Open the Explorer ↗
          </Link>
        </main>
      )}
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
