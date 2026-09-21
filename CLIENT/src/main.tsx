// Defensive browser compatibility: Ensure window.fetch has a setter if any polyfill/dependency reassigns it
try {
  if (typeof window !== 'undefined') {
    const origFetch = window.fetch ? window.fetch.bind(window) : undefined;
    let curFetch = origFetch;
    Object.defineProperty(window, 'fetch', {
      get: () => curFetch,
      set: (fn: any) => {
        curFetch = fn;
      },
      configurable: true,
      enumerable: true,
    });
  }
} catch (_) {
  // Silent fallback if already writable
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
