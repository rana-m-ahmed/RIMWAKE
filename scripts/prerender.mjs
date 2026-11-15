import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToReadableStream } from 'react-dom/server';
import { readFile, writeFile, readdir } from 'node:fs/promises';
// Static HTML only. Scientific release still loads and verifies in the browser.
globalThis.location = { pathname: '/', search: '', hash: '', origin: 'http://localhost' };
globalThis.matchMedia = () => ({ matches: false });
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const template = await readFile('dist/index.html', 'utf8');
  for (const [pathname, filename] of [
    ['/', 'index.html'],
    ['/explore', 'explore.html'],
    ['/field-guide', 'field-guide.html'],
    ['/sources', 'sources.html'],
    ['/404', '404.html'],
  ]) {
    globalThis.location.pathname = pathname;
    const stream = await renderToReadableStream(createElement(App));
    await stream.allReady;
    const markup = await new Response(stream).text();
    const css = (await readdir('dist/assets'))
      .filter(
        (name) =>
          name.endsWith('.css') &&
          (pathname === '/'
            ? name.startsWith('MissionStory-') || name.startsWith('Story-')
            : pathname === '/field-guide' || pathname === '/sources'
              ? name.startsWith('Guide-')
              : pathname === '/explore'
                ? name.startsWith('Mission-')
                : false),
      )
      .map((name) => `<link rel="stylesheet" href="/assets/${name}">`)
      .join('');
    await writeFile(
      'dist/' + filename,
      (pathname === '/'
        ? template
        : template.replace(/<link\b(?=[^>]*\bas="image")(?=[^>]*\brel="preload")[^>]*>/g, '')
      )
        .replace('</head>', css + '</head>')
        .replace('<div id="root"></div>', '<div id="root">' + markup + '</div>'),
    );
    console.log('Pre-rendered ' + pathname);
  }
} finally {
  await server.close();
}
