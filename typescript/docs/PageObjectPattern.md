# Page Object Pattern

This document describes the page object pattern implemented in `typescript/examples/PO_example.ts`.

## Intent

Each page object represents one UI page and is responsible for:
- Defining page locators in one place.
- Exposing strongly named page methods for test steps.
- Delegating common interactions to reusable helper methods in `typescript/code/framework/POBase.ts`.

## Shared Page Object Shape

All page objects follow the same core structure:
- Extend `POBase`.
- Accept the same constructor dependencies: `page: Page` and `eventLogger: EventLogger`.
- Use the shared Playwright page instance (`this.page`) for all element interactions.
- Keep a consistent set of attributes (selectors + locators + action/value methods).

Example class shape:
- Class extends `POBase`.
- Constructor calls `super(page, eventLogger)`.
- Locators are created once and reused across methods.

## Locator Rules

- All page locators are private to the page object.
- Tests and external callers do not interact with raw selectors or raw locators directly.
- The page object exposes semantic methods instead (for example: set city, validate zip code, click OK).

This keeps tests readable and isolates selector changes to one class.

## Naming Convention (Strict)

Input-style fields follow a strict naming convention:
- Getter: `get<FieldName>()`
- Setter: `set<FieldName>(newValue: string)`
- Validator: `validate<FieldName>(expectedValue: string, exactMatchRequired = false)`

Examples:
- `getStreetAddress`, `setStreetAddress`, `validateStreetAddress`
- `getCity`, `setCity`, `validateCity`
- `getState`, `setState`, `validateState`
- `getZipCode`, `setZipCode`, `validateZipCode`

Read-only elements use only the methods that make sense:
- Display-only element: getter and/or validator.
- No setter for read-only content.

## Clickable Elements

Buttons and other clickable elements expose explicit click methods:
- `clickOkButton()`
- `clickCancelButton()`

Method names should describe user intent and the target element clearly.

## POBase Helper Methods Power Most Behavior

Most page object methods are thin wrappers around helpers in `typescript/code/framework/POBase.ts`:

- `setElementValue(field, newValue, description)`
  - Handles `input`, `textarea`, and `select` appropriately.
- `getElementValue(field)`
  - Reads element value/text based on element type.
- `validateElementText(field, expectedValue, description, exactMatchRequired)`
  - Supports exact and partial matching with standardized error messages.
- `clickElement(field, description, elementTypeOverride?)`
  - Logs and performs click actions consistently.

## Why This Pattern

This pattern gives:
- Consistent page object APIs across pages.
- Better maintainability when selectors change.
- Reusable interaction logic with centralized error handling and logging.
- More readable and intention-focused tests.
