import { defineConfig } from 'vite';
import webExtension from '@samrum/vite-plugin-web-extension';
import path from 'path';
import { type UserConfig } from 'vite';

export default defineConfig(({ mode }): UserConfig => {
  return {
    plugins: [
      webExtension({
        manifest: 'manifest.json',
        usePolyfill: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: process.env.VITE_BUILD_OUT_DIR || 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development' ? 'inline' : false,
      minify: mode === 'production',
    },
  };
});