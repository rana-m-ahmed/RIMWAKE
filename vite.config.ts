import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  ssr: { noExternal: ['gsap', '@gsap/react'] },
  plugins: [
    react(),
    {
      name: 'static-route-preview',
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = new URL(request.url ?? '/', 'http://localhost');
          if (['/explore', '/field-guide', '/sources', '/method'].includes(url.pathname))
            request.url =
              '/' +
              (url.pathname === '/method' ? 'sources' : url.pathname.slice(1)) +
              '.html' +
              url.search;
          if (
            !['/', '/explore', '/field-guide', '/sources', '/method'].includes(url.pathname) &&
            !url.pathname.includes('.') &&
            !url.pathname.startsWith('/data/') &&
            !url.pathname.startsWith('/assets/')
          ) {
            request.url = '/404.html';
            _response.statusCode = 404;
          }
          next();
        });
      },
    },
  ],
});
