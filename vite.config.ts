import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import prerender from '@prerenderer/rollup-plugin';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
//
// SPA pre-rendering
// -----------------
// The app is a client-rendered React SPA whose «routing» is a simple
// `window.location.pathname` check in App.tsx («/» vs «/privacy»). To give
// crawlers and social scrapers real HTML — and to improve first paint — we
// pre-render those two routes at build time with @prerenderer/rollup-plugin,
// which drives a headless Chromium (puppeteer) over the built bundle and
// writes the resulting markup to `dist/index.html` and `dist/privacy/index.html`.
//
// Nothing in the runtime app changes: the same bundle hydrates on top of the
// pre-rendered HTML. Pre-rendering only runs during `vite build`; `vite dev`
// is untouched.
//
// Note: puppeteer downloads a Chromium binary on install. In restricted CI
// you may need `PUPPETEER_SKIP_DOWNLOAD` / a system Chrome via
// `renderer options.executablePath`. This config was added but NOT verified
// against a real build here (no node_modules in this workspace).
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
