import { test as base, expect } from '@playwright/test';
import AddressFormPage from './PO_example';

type FoundationTestFixtures = {
  addressFormPage: AddressFormPage;
};

type FoundationWorkerFixtures = {
  appBaseUrl: string;
  formUrl: string;
};

// Shared Playwright foundation used by all tests importing this module.
// - appBaseUrl is computed once per worker (similar to beforeAll).
// - formUrl is computed once per worker (beforeAll equivalent).
// - addressFormPage is created and navigated per test (beforeEach equivalent).
export const test = base.extend<FoundationTestFixtures, FoundationWorkerFixtures>({
  appBaseUrl: [
    async ({}, use, workerInfo) => {
      const workspaceRoot = workerInfo.config.rootDir;
      const repoRoot = workspaceRoot.replace(/[\\/]typescript$/, '');
      const normalizedRepoRoot = repoRoot.replace(/\\/g, '/');
      const baseWithTrailingSlash = normalizedRepoRoot.endsWith('/')
        ? normalizedRepoRoot
        : `${normalizedRepoRoot}/`;

      await use(`file:///${baseWithTrailingSlash}`);
    },
    { scope: 'worker' },
  ],

  formUrl: [
    async ({ appBaseUrl }, use) => {
      await use(buildAppUrl(appBaseUrl, 'html/AddressForm.html'));
    },
    { scope: 'worker' },
  ],

  addressFormPage: async ({ page, formUrl }, use) => {
    await page.goto(formUrl);
    const addressFormPage = new AddressFormPage(page);
    await use(addressFormPage);
  },
});

export { expect };

export function buildAppUrl(appBaseUrl: string, relativePath: string): string {
  return new URL(relativePath, appBaseUrl).toString();
}