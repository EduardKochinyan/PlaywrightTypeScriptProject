import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  globalSetup: './global-setup.ts',
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['./reporters/steps-reporter.ts'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'ui-chrome',
      use: { ...devices['Desktop Chrome'], launchOptions: { slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 0 } },
      testMatch: '**/ui/**/*.spec.ts',
    },
    {
      name: 'api',
      use: {
        baseURL: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
      testMatch: '**/api/**/*.spec.ts',
    },
  ],
});
