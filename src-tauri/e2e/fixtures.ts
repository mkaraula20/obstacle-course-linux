// e2e/fixtures.ts
import { createTauriTest } from '@srsholmes/tauri-playwright';

export const { test, expect } = createTauriTest({
  devUrl: 'http://localhost:5173',
  tauriCommand: '/tmp/obstacle-course',
  ipcMocks: {
    greet: (args) => `Hello, ${(args as { name?: string })?.name}!`,
  },
  mcpSocket: '/tmp/tauri-playwright.sock',
});