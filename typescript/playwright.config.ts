import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './code/tests',
  testMatch: ['**/*.spec.ts', '**/*.test.ts', '**/TEST_*.ts'],
  outputDir: 'playwright-results',
});
