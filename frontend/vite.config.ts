import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

import packageJson from '../package.json';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const API_HOST =
    mode === 'development' ? 'http://192.168.0.244:8080/api' : '/api';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
    },
    define: {
      __API_HOST__: JSON.stringify(API_HOST),
      __VERSION__: packageJson.version,
    },
    build: {
      outDir: path.join(__dirname, '..', 'dist', 'client'),
    },
  };
});
