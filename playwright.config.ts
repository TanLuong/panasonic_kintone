
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Read from .dev.env for credentials if needed, though usually strict E2E shouldn't rely on local env files 
// but here we follow the user's setup.
// Example: dotenv.config({ path: path.resolve(__dirname, 'src/projects/grand-hotel/hotel-reservation-registration/.dev.env') });

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://development.kintone.com',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
