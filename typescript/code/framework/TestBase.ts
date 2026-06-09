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
// - appBaseUrl is read from Playwright settings once per worker (similar to beforeAll).
// - formUrl is computed once per worker (beforeAll equivalent).
export const test = base.extend<FoundationTestFixtures, FoundationWorkerFixtures>({
  appBaseUrl: [
    async ({}, use, workerInfo) => {
      const configuredBaseUrl = workerInfo.project.use.baseURL;

      if (!configuredBaseUrl) {
        throw new Error('Missing Playwright use.baseURL setting in playwright.config.ts.');
      }

      await use(configuredBaseUrl);
    },
    { scope: 'worker' },
  ],

  formUrl: [
    async ({ appBaseUrl }, use) => {
      await use(appBaseUrl);
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
  if (testInfo.error) {
    eventLogger.addFailure('the test failed');
    eventLogger.addStackTrace(testInfo.error.stack ?? String(testInfo.error));
  }

  const describeTitle = testInfo.titlePath.length > 1
    ? testInfo.titlePath[testInfo.titlePath.length - 2]
    : 'Suite';
  const testTitle = testInfo.title;
  const failurePrefix = testInfo.error ? '_failure_' : '';
  const fileName = `${failurePrefix}${toSafeFileSegment(describeTitle)}~${toSafeFileSegment(testTitle)}.md`;
  const outputPath = `${suiteOutputFolder}/${fileName}`;

  await eventLogger.createDocument(outputPath);
});

test.afterAll(async () => {
  // Runs once after all tests in this file/describe complete; use it for suite-level
  // cleanup, final reporting, or aggregating artifacts produced across the run.
});

export { expect };

function toSafeFileSegment(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'unnamed';
  }

  return trimmed.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '_');
}
