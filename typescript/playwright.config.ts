import { defineConfig } from '@playwright/test';

const initialPageUrl = 'file:///C:/Repos/eurostar/html/AddressForm.html';

export default defineConfig({
  testDir: './code/tests',
  testMatch: ['**/*.spec.ts', '**/*.test.ts', '**/TEST_*.ts', '**/*Tests.ts'],
  outputDir: 'playwright-results',
  use: {
    baseURL: initialPageUrl,
  },
});
