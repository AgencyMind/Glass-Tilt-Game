import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  entrypointsDir: 'src',
  manifest: {
    manifest_version: 3,
    name: 'Glass Tilt Game',
    version: '0.1.0',
    description: 'Reimagining content discovery on Lens.',
    icons: {
      '48': '/icons/icon-48.png',
      '96': '/icons/icon-96.png',
      '128': '/icons/icon-128.png',
    },
    host_permissions: ['https://*.hey.xyz/*'],
  },
  contentScripts: [
    {
      matches: ['https://*.hey.xyz/*'],
      main: 'content_scripts/tilt-button.ts',
      runAt: 'document_idle',
    },
  ],
  background: {
    serviceWorker: 'background_scripts/background.ts',
  },
});