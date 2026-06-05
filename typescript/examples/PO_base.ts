import { Locator, Page } from '@playwright/test';
import { EventLogger } from '../code/framework/EventLogger';

export class POBase {
  protected readonly page: Page;
  protected readonly eventLogger: EventLogger;

  constructor(page: Page, eventLogger: EventLogger) {
    this.page = page;
    this.eventLogger = eventLogger;
  }

  // Sets a field's value using the appropriate Playwright interaction for the
  // element type. The description parameter is used in error messages to make
  // failures easy to trace back to a specific field without reading raw selectors.
  async setElementValue(field: Locator, newValue: string, description: string): Promise<void> {
    const tagName = await field.evaluate((el) => el.tagName.toLowerCase());
    this.eventLogger.addMessage(
      `Set the value '${newValue}' in the ${description.toUpperCase()} ${tagName}`
    );

    switch (tagName) {
      case 'input':
      case 'textarea':
        // fill() clears any existing content before typing, which is the
        // expected behaviour for most form automation scenarios.
        await field.fill(newValue);
        break;

      case 'select':
        // Matching by label (the visible option text) keeps tests readable and
        // decoupled from internal value attributes that users never see.
        await field.selectOption({ label: newValue });
        break;

      default:
        throw new Error(
          `setElementValue: unsupported element type "<${tagName}>" for field "${description}". ` +
          `Supported types are: input, textarea, select.`
        );
    }
  }

  // Logs a human-readable action message then clicks the element. The descriptor
  // is uppercased so it stands out clearly in event logs during a test run.
  async clickElement(field: Locator, description: string, elementTypeOverride?: string): Promise<void> {
    const tagName = elementTypeOverride ?? await field.evaluate((el) => el.tagName.toLowerCase());
    this.eventLogger.addMessage(`Click the ${description.toUpperCase()} ${tagName}`);
    await field.click();
  }

  // Validates that an element contains or exactly matches an expected value.
  // The method returns a boolean so calling code can choose how to assert or
  // branch on the result.
  async validateElementText(
    field: Locator,
    expectedValue: string,
    description: string,
    exactMatchRequired = false
  ): Promise<void> {
    const matchType = exactMatchRequired ? 'exactly matches' : 'partially matches';
    this.eventLogger.addMessage(
      `Verify that the value '${expectedValue}' ${matchType} the element ${description.toUpperCase()}`
    );

    const actualValue = await this.getElementValue(field);

    if (exactMatchRequired) {
      if (actualValue !== expectedValue) {
        throw new Error(
          `validateElementText: expected exact value "${expectedValue}" for "${description}", but found "${actualValue}".`
        );
      }

      return;
    }

    if (!actualValue.includes(expectedValue)) {
      throw new Error(
        `validateElementText: expected "${description}" to contain "${expectedValue}", but found "${actualValue}".`
      );
    }
  }

  // Returns the current visible value of an element. For inputs and textareas
  // this is the value attribute; for selects it is the display text of the
  // selected option rather than its underlying value attribute. For common
  // display elements (span/div/li), this returns text content.
  async getElementValue(field: Locator): Promise<string> {
    const tagName = await field.evaluate((el) => el.tagName.toLowerCase());

    switch (tagName) {
      case 'input':
      case 'textarea':
        return field.inputValue();

      case 'select':
        // Retrieve the label of the selected option so callers always work
        // with the text the user sees, consistent with setElementValue.
        return field.evaluate((el) => {
          const select = el as HTMLSelectElement;
          return select.options[select.selectedIndex]?.text ?? '';
        });

      case 'span':
      case 'div':
      case 'li':
        return (await field.textContent()) ?? '';

      default:
        throw new Error(
          `getElementValue: unsupported element type "<${tagName}>". ` +
          `Supported types are: input, textarea, select, span, div, li.`
        );
    }
  }
}

export default POBase;