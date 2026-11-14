import { useEffect } from 'react';
import { DataProvider } from './lib/data';
import { SelectionProvider } from './lib/selection';
import { Link, Router, useRoute } from './lib/router';
import { Footer, Header } from './components/Shell';
import Experience from './pages/Experience';
import Observatory from './pages/Observatory';
import FieldGuide from './pages/FieldGuide';
import Sources from './pages/Sources';

function Routes() {
  const route = useRoute();
  useEffect(() => {
    document.title = `RIMWAKE · ${route.path === '/explore' ? 'Your local sky' : route.path === '/field-guide' ? 'Field Guide' : route.path === '/sources' ? 'Sources & evidence' : 'Where you stand changes the sky'}`;
    if (route.path === '/' && (route.hash === '#instrument' || route.hash === '#explore'))
      route.navigate('/explore', true);
    if (route.path === '/' && route.hash === '#method') route.navigate('/method', true);
    if (route.path === '/method') route.navigate('/sources' + route.hash, true);
  }, [route.path, route.hash]);
  return (
    <>
      <Header />
      {route.path === '/' ? (
        <Experience />
      ) : route.path === '/explore' ? (
        <Observatory />
      ) : route.path === '/field-guide' ? (
        <FieldGuide />
      ) : route.path === '/sources' ? (
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
