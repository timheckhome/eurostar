import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['**/examples/TEST_*.ts'],
  outputDir: 'playwright-results',
});
