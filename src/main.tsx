import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/ibm-plex-sans/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './styles.css';
import App from './App';
const host = document.getElementById('root')!;
const application = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (host.hasChildNodes()) hydrateRoot(host, application);
else createRoot(host).render(application);
