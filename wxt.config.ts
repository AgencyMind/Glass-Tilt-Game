import { defineConfig } from 'wxt';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  srcDir: path.join(root, 'src'),
  entrypointsDir: 'entrypoints',
  publicDir: path.join(root, 'public'),
  browser: 'firefox',
  webExt: {
    disabled: true
  },
  vite: () => ({
    server: {
      open: false
    }
  }),
  manifest: {
    manifest_version: 3,
    name: 'Glass Tilt Game',
    version: '0.1.0',
    description: 'Reimagining content discovery on Lens.',
    icons: {
      '48': 'icons/icon-48.png',
      '96': 'icons/icon-96.png',
      '128': 'icons/icon-128.png'
    },
    host_permissions: ['https://*.hey.xyz/*']
  },
  alias: {
    '@': path.join(root, 'src')
  }
});