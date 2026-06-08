# Test Construction Pattern

This document defines the standard test pattern used in `typescript/examples/TEST_example.ts`.
It is intended for both human contributors and GitHub Copilot agentic workflows.

## Goals

- Keep test files consistent and easy to scale.
- Ensure all tests benefit from shared lifecycle behavior in `typescript/code/framework/TestBase.ts`.
- Provide a predictable place for file-specific setup code.

## Required Structure For Every Test File

Each Playwright test file must follow this shape:

1. Import `test` (and `expect` when needed) from `typescript/code/framework/TestBase.ts`.
2. Define a file-level method named `testSetup`.
3. Implement a file-level `test.beforeEach` hook that calls `testSetup`.
4. Include exactly one `test.describe(...)` block.
5. Place one or more `test(...)` cases inside that single describe block.

## Why TestBase Is Mandatory

All tests must inherit from `TestBase` by importing:

- `test` from `typescript/code/framework/TestBase.ts`

`TestBase` provides shared foundation behavior, including:

- Common lifecycle hooks (before/after).
- Initial navigation and URL setup.
- Shared fixtures (for example, event logger).
- Suite/test artifact handling.

This keeps behavior centralized and avoids duplicate setup logic in individual test files.

## File-Level Setup Extension Pattern

Many test files require extra setup beyond the base lifecycle hook.
To support that consistently, each test file must include this exact method name:

```ts
async function testSetup(): Promise<void> {
	// put additional setup code here
}
```

Then call it from a file-level `beforeEach`:

```ts
test.beforeEach(async () => {
	await testSetup();
});
```

Execution order expectation:

1. Base lifecycle hook from `TestBase` runs first.
2. File-level `test.beforeEach` runs next.
3. `testSetup` executes immediately after base setup completes.
4. The test body executes.

## Canonical Skeleton

Use this as the baseline for new test files:

```ts
import { test } from '../code/framework/TestBase';
import SomePageObject from './SomePageObject';

async function testSetup(): Promise<void> {
	// put additional setup code here
}

test.describe('Feature Name', () => {
	test.beforeEach(async () => {
		await testSetup();
	});

	test('Scenario 1', async ({ page, eventLogger }) => {
		const featurePage = new SomePageObject(page, eventLogger);
		// arrange/act/assert
	});

	test('Scenario 2', async ({ page, eventLogger }) => {
		const featurePage = new SomePageObject(page, eventLogger);
		// arrange/act/assert
	});
});
```

## Current Reference Implementation

The current concrete implementation of this pattern is:

- `typescript/examples/TEST_example.ts`

Use that file as the source of truth when in doubt.
