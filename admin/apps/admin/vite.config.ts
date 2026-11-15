import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// School Admin-only console app (ADR-0008) — never bundles Teacher or Support code.
export default defineConfig({
  plugins: [react()],
  server: { port: 5175, open: true },
  build: { target: 'es2022' },
});
