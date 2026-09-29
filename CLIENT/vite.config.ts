import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

/**
 * DEV ONLY - "Kill switch" Service Worker.
 *
 * Jika browser masih menyimpan Service Worker dari proyek lain (mis. yang memakai
 * vite-plugin-pwa) di origin yang sama (localhost:PORT), SW lama itu akan terus
 * menyajikan HTML lama dari cache. Akibatnya muncul error:
 *   - 404 /@vite-plugin-pwa/pwa-entry-point-loaded
 *   - manifest.webmanifest: Syntax error
 *   - @vitejs/plugin-react can't detect preamble
 *
 * Browser selalu memeriksa ulang file SW ke server. Plugin ini menyajikan SW
 * pengganti di URL SW yang umum dipakai; SW tersebut menghapus semua cache,
 * mencabut dirinya sendiri, lalu me-reload halaman.
 */
function killStaleServiceWorker(): Plugin {
  const swPaths = [
    '/sw.js',
    '/service-worker.js',
    '/serviceworker.js',
    '/dev-sw.js',
    '/registerSW.js',
    '/dev-dist/sw.js',
  ];

  const killSwitch = `
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {}
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});
self.addEventListener('fetch', () => {});
`;

  return {
    name: 'kill-stale-service-worker',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        const isSw =
          swPaths.includes(url) || /^\/workbox-[\w-]+\.js$/.test(url);

        if (isSw) {
          res.setHeader('Content-Type', 'application/javascript');
          res.setHeader('Cache-Control', 'no-store');
          res.setHeader('Service-Worker-Allowed', '/');
          res.end(killSwitch);
          return;
        }

        // Manifest PWA lama: kembalikan JSON valid agar tidak "Syntax error"
        if (url === '/manifest.webmanifest' || url === '/manifest.json') {
          res.setHeader('Content-Type', 'application/manifest+json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify({ name: 'RSIA Sayang Ibu', start_url: '/' }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    // react() wajib aktif agar Vite menyisipkan preamble React Refresh
    // (window.$RefreshReg$) ke index.html saat mode dev.
    plugins: [killStaleServiceWorker(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      // Pastikan hanya ada 1 salinan React (mencegah error hook / refresh)
      dedupe: ['react', 'react-dom'],
    },
    server: {
      // Port 5173 = default Vite & sesuai README. Port 3000 sering dipakai
      // proyek lain sehingga cache/Service Worker lama ikut terbawa.
      port: 5173,
      strictPort: true,
      host: '0.0.0.0',
      hmr: {
        overlay: true,
      },
    },
    build: {
      cssMinify: true,
      minify: 'esbuild' as const,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-icons': ['lucide-react'],
            'vendor-motion': ['motion'],
          },
        },
      },
    },
  };
});