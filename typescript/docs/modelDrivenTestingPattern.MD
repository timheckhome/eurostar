# Model Based Testing (MBT) Pattern for Form Pages

## Purpose

This document defines the MBT (Model Based Testing) pattern used in this repository for form-based page objects.

In this pattern, test data is represented as a dictionary (key-value pairs). Page objects consume that dictionary to:

- populate form controls using `fillForm`
- validate form controls using `validateForm`

This approach keeps tests concise, reusable, and consistent across pages.

## Core MBT Rules

1. Every form page object must implement `fillForm(data)`.
2. Every form page object must implement `validateForm(expected)`.
3. `fillForm` and `validateForm` must both:
	 - process keys in a case-insensitive way
	 - ignore keys that do not match any control
4. Unknown keys must never fail a test by themselves.
5. `fillForm` must call page-object setter methods (for example, `setCity`) and not interact with raw locators directly.
6. `validateForm` must call page-object validation methods (for example, `validateCity`) and not validate raw locators directly.
7. Page objects should define a central map between model keys and method handlers.
8. Each page object must include a comment block with a complete sample dictionary structure for all supported fields.

## Why This Pattern

- Reduces duplicated test code
- Makes adding new fields predictable
- Allows partial payloads (only supply fields needed by a test)
- Makes tests robust when additional, unrelated keys are present
- Encourages a clear contract between test data and UI controls

## Data Shape Guidance

Use a plain object as a dictionary. Example shape:

```ts
type FormData = Record<string, string | number | boolean | null | undefined>;
```

The page object should normalize incoming keys to lower case before matching.

## Required `fillForm` Behavior

`fillForm(data)` should:

1. Exit early if `data` is null/undefined.
2. Normalize all incoming keys to a comparable format (for example, `toLowerCase()`).
3. For each key:
	 - if a matching field exists, call the matching page-object setter method
	 - if no matching control exists, ignore it
4. Continue processing all keys without throwing because of unknown keys.
5. Do not call raw locator methods from `fillForm`; route through semantic setters.

Reference implementation pattern:

```ts
public async fillForm(data: Record<string, unknown>): Promise<void> {
	if (!data) return;

	const handlers: Record<string, (value: unknown) => Promise<void>> = {
		streetaddress: async (value) => this.setStreetAddress(String(value ?? "")),
		city: async (value) => this.setCity(String(value ?? "")),
		state: async (value) => this.setState(String(value ?? "")),
		zipcode: async (value) => this.setZipCode(String(value ?? "")),
	};

	for (const [rawKey, value] of Object.entries(data)) {
		const key = rawKey.toLowerCase();
		const handler = handlers[key];
		if (!handler) continue; // Unknown key: ignore by design
		await handler(value);
	}
}
```

This keeps MBT aligned with the page-object contract described in [typescript/docs/PageObjectPattern.md](typescript/docs/PageObjectPattern.md): tests and orchestration methods (`fillForm`) use semantic page methods, not locator-level interactions.

## Required `validateForm` Behavior

`validateForm(expected)` should follow the same key-handling rules as `fillForm`:

1. Normalize keys case-insensitively.
2. Validate only keys that match known fields.
3. Ignore unknown keys.
4. Do not call raw locator assertions from `validateForm`; route through semantic validators.

Reference implementation pattern:

```ts
public async validateForm(expected: Record<string, unknown>): Promise<void> {
	if (!expected) return;

	const validators: Record<string, (value: unknown) => Promise<void>> = {
		streetaddress: async (value) =>
			await this.validateStreetAddress(String(value ?? "")),
		city: async (value) => await this.validateCity(String(value ?? "")),
		state: async (value) => await this.validateState(String(value ?? "")),
		zipcode: async (value) => await this.validateZipCode(String(value ?? "")),
	};

	for (const [rawKey, value] of Object.entries(expected)) {
		const key = rawKey.toLowerCase();
		const validator = validators[key];
		if (!validator) continue; // Unknown key: ignore by design
		await validator(value);
	}
}
```

`validateForm` should use the existing page validators so behavior stays consistent with shared helper logic in your `POBase` flow.

## Page Object Contract (Required)

Each page object should:

- expose locators for supported controls
- keep a key-to-method strategy that is easy to read and maintain
- implement `fillForm` and `validateForm` with matching key semantics
- include a comment block that documents a full sample payload

### Required Page Object Comment Block

Include a block like this near the class definition so test authors know the expected structure:

```ts
/**
 * MBT sample payload for this page object:
 * {
 *   firstName: "Ada",
 *   lastName: "Lovelace",
 *   email: "ada@example.com",
 *   phone: "5551234567",
 *   subscribe: true
 * }
 *
 * Notes:
 * - Keys are matched case-insensitively.
 * - Unknown keys are ignored.
 * - Any subset of supported keys can be provided.
 */
```

## Usage in Tests

Tests should pass dictionaries to page objects instead of calling individual field methods whenever possible.

```ts
await addressPage.fillForm({
	StreetAddress: "1 Main St",
	CITY: "Seattle",
	state: "WA",
	zipCode: "98101",
	extraFieldNotOnPage: "ignored",
});

await addressPage.validateForm({
	streetaddress: "1 Main St",
	City: "Seattle",
	STATE: "WA",
	ZIPCODE: "98101",
});
```

## Enforcement Intent

This document is intended to be referenced in GitHub Copilot agentic sessions so that all page objects follow the same MBT contract.

When creating or refactoring page objects, Copilot should ensure:

- `fillForm` exists and follows case-insensitive matching
- `validateForm` exists and follows case-insensitive matching
- `fillForm` routes through `set<FieldName>` methods
- `validateForm` routes through `validate<FieldName>` methods
- unknown keys are ignored in both methods
- a complete MBT sample comment block is present in the page object
