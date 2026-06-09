# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: AddressFormTests.ts >> Address Form MBT Tests >> Validate failure message is shown when zip code is not filled and submit is pressed
- Location: code\tests\AddressFormTests.ts:57:7

# Error details

```
Error: validateElementText: expected exact value "Zip code is required." for "validation message", but found "Form submitted successfully!".
```

# Test source

```ts
  1   | import { Locator, Page } from '@playwright/test';
  2   | import { EventLogger } from './EventLogger';
  3   | 
  4   | export class POBase {
  5   |   protected readonly page: Page;
  6   |   protected readonly eventLogger: EventLogger;
  7   | 
  8   |   constructor(page: Page, eventLogger: EventLogger) {
  9   |     this.page = page;
  10  |     this.eventLogger = eventLogger;
  11  |   }
  12  | 
  13  |   // Sets a field's value using the appropriate Playwright interaction for the
  14  |   // element type. The description parameter is used in error messages to make
  15  |   // failures easy to trace back to a specific field without reading raw selectors.
  16  |   async setElementValue(field: Locator, newValue: string, description: string): Promise<void> {
  17  |     const tagName = await field.evaluate((el) => el.tagName.toLowerCase());
  18  |     this.eventLogger.addMessage(
  19  |       `Set the value '${newValue}' in the ${description.toUpperCase()} ${tagName}`
  20  |     );
  21  | 
  22  |     switch (tagName) {
  23  |       case 'input':
  24  |       case 'textarea':
  25  |         // fill() clears any existing content before typing, which is the
  26  |         // expected behaviour for most form automation scenarios.
  27  |         await field.fill(newValue);
  28  |         break;
  29  | 
  30  |       case 'select':
  31  |         // Matching by label (the visible option text) keeps tests readable and
  32  |         // decoupled from internal value attributes that users never see.
  33  |         await field.selectOption({ label: newValue });
  34  |         break;
  35  | 
  36  |       default:
  37  |         throw new Error(
  38  |           `setElementValue: unsupported element type "<${tagName}>" for field "${description}". ` +
  39  |           `Supported types are: input, textarea, select.`
  40  |         );
  41  |     }
  42  |   }
  43  | 
  44  |   // Logs a human-readable action message then clicks the element. The descriptor
  45  |   // is uppercased so it stands out clearly in event logs during a test run.
  46  |   async clickElement(field: Locator, description: string, elementTypeOverride?: string): Promise<void> {
  47  |     const tagName = elementTypeOverride ?? await field.evaluate((el) => el.tagName.toLowerCase());
  48  |     this.eventLogger.addMessage(`Click the ${description.toUpperCase()} ${tagName}`);
  49  |     await field.click();
  50  |   }
  51  | 
  52  |   // Validates that an element contains or exactly matches an expected value.
  53  |   // The method returns a boolean so calling code can choose how to assert or
  54  |   // branch on the result.
  55  |   async validateElementText(
  56  |     field: Locator,
  57  |     expectedValue: string,
  58  |     description: string,
  59  |     exactMatchRequired = false
  60  |   ): Promise<void> {
  61  |     const matchType = exactMatchRequired ? 'exactly matches' : 'partially matches';
  62  |     this.eventLogger.addMessage(
  63  |       `Verify that the value '${expectedValue}' ${matchType} the element ${description.toUpperCase()}`
  64  |     );
  65  | 
  66  |     const actualValue = await this.getElementValue(field);
  67  | 
  68  |     if (exactMatchRequired) {
  69  |       if (actualValue !== expectedValue) {
> 70  |         throw new Error(
      |               ^ Error: validateElementText: expected exact value "Zip code is required." for "validation message", but found "Form submitted successfully!".
  71  |           `validateElementText: expected exact value "${expectedValue}" for "${description}", but found "${actualValue}".`
  72  |         );
  73  |       }
  74  | 
  75  |       return;
  76  |     }
  77  | 
  78  |     if (!actualValue.includes(expectedValue)) {
  79  |       throw new Error(
  80  |         `validateElementText: expected "${description}" to contain "${expectedValue}", but found "${actualValue}".`
  81  |       );
  82  |     }
  83  |   }
  84  | 
  85  |   // Returns the current visible value of an element. For inputs and textareas
  86  |   // this is the value attribute; for selects it is the display text of the
  87  |   // selected option rather than its underlying value attribute. For common
  88  |   // display elements (span/div/li), this returns text content.
  89  |   async getElementValue(field: Locator): Promise<string> {
  90  |     const tagName = await field.evaluate((el) => el.tagName.toLowerCase());
  91  | 
  92  |     switch (tagName) {
  93  |       case 'input':
  94  |       case 'textarea':
  95  |         return field.inputValue();
  96  | 
  97  |       case 'select':
  98  |         // Retrieve the label of the selected option so callers always work
  99  |         // with the text the user sees, consistent with setElementValue.
  100 |         return field.evaluate((el) => {
  101 |           const select = el as HTMLSelectElement;
  102 |           return select.options[select.selectedIndex]?.text ?? '';
  103 |         });
  104 | 
  105 |       case 'span':
  106 |       case 'div':
  107 |       case 'li':
  108 |         return (await field.textContent()) ?? '';
  109 | 
  110 |       default:
  111 |         throw new Error(
  112 |           `getElementValue: unsupported element type "<${tagName}>". ` +
  113 |           `Supported types are: input, textarea, select, span, div, li.`
  114 |         );
  115 |     }
  116 |   }
  117 | }
  118 | 
  119 | export default POBase;
```