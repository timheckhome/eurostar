import { test as base, expect } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { EventLogger } from './EventLogger';

type FoundationTestFixtures = {
  eventLogger: EventLogger;
};

type FoundationWorkerFixtures = {
  appBaseUrl: string;
  formUrl: string;
};

const EVENT_LOG_ROOT = 'test-results/event-logs';
let suiteOutputFolder = '';

// Shared Playwright foundation used by all tests importing this module.
// - appBaseUrl is computed once per worker (similar to beforeAll).
// - formUrl is computed once per worker (beforeAll equivalent).
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

  eventLogger: async ({}, use) => {
    await use(new EventLogger());
  },
});

test.beforeEach(async ({ page, formUrl }) => {
  await page.goto(formUrl);
});

test.beforeAll(async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  suiteOutputFolder = `${EVENT_LOG_ROOT}/${timestamp}`;
  await mkdir(suiteOutputFolder, { recursive: true });
});

test.afterEach(async ({ eventLogger }, testInfo) => {
  const describeTitle = testInfo.titlePath.length > 1
    ? testInfo.titlePath[testInfo.titlePath.length - 2]
    : 'Suite';
  const testTitle = testInfo.title;
  const fileName = `${toSafeFileSegment(describeTitle)}~${toSafeFileSegment(testTitle)}.md`;
  const outputPath = `${suiteOutputFolder}/${fileName}`;

  await eventLogger.createDocument(outputPath);
});

test.afterAll(async () => {
  // Runs once after all tests in this file/describe complete; use it for suite-level
  // cleanup, final reporting, or aggregating artifacts produced across the run.
});

export { expect };

export function buildAppUrl(appBaseUrl: string, relativePath: string): string {
  return new URL(relativePath, appBaseUrl).toString();
}

function toSafeFileSegment(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'unnamed';
  }

  return trimmed.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_');
}