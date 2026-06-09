import { Locator, Page } from '@playwright/test';
import { EventLogger } from '../framework/EventLogger';
import POBase from '../framework/POBase';

type FormModel = Record<string, unknown>;

/**
 * MBT sample payload for this page object:
 * {
 *   streetAddress: '1 Main St',
 *   city: 'Seattle',
 *   state: 'California',
 *   zipCode: '98101'
 * }
 *
 * Notes:
 * - Keys are matched case-insensitively.
 * - Unknown keys are ignored.
 * - Any subset of supported keys can be provided.
 */
export class AddressFormPage extends POBase {
  private readonly selectors = {
    heading: 'h1',
    backToHomeLink: '#backToHomeFromAddress',
    streetAddressInput: '#streetAddress',
    cityInput: '#city',
    stateSelect: '#state',
    zipCodeInput: '#zipCode',
    submitAddressButton: '#submitAddressButton',
    clearAddressButton: '#clearAddressButton',
    addressMessage: '#addressMessage',
  } as const;

  private readonly heading: Locator;
  private readonly backToHomeLink: Locator;
  private readonly streetAddressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateSelect: Locator;
  private readonly zipCodeInput: Locator;
  private readonly submitAddressButton: Locator;
  private readonly clearAddressButton: Locator;
  private readonly addressMessage: Locator;
  private readonly fillFormHandlers: Record<string, (value: unknown) => Promise<void>>;
  private readonly validateFormHandlers: Record<string, (value: unknown) => Promise<void>>;

  constructor(page: Page, eventLogger: EventLogger) {
    super(page, eventLogger);
    this.heading = page.locator(this.selectors.heading);
    this.backToHomeLink = page.locator(this.selectors.backToHomeLink);
    this.streetAddressInput = page.locator(this.selectors.streetAddressInput);
    this.cityInput = page.locator(this.selectors.cityInput);
    this.stateSelect = page.locator(this.selectors.stateSelect);
    this.zipCodeInput = page.locator(this.selectors.zipCodeInput);
    this.submitAddressButton = page.locator(this.selectors.submitAddressButton);
    this.clearAddressButton = page.locator(this.selectors.clearAddressButton);
    this.addressMessage = page.locator(this.selectors.addressMessage);

    this.fillFormHandlers = {
      streetaddress: async (value) => this.setStreetAddress(String(value ?? '')),
      city: async (value) => this.setCity(String(value ?? '')),
      state: async (value) => this.setState(String(value ?? '')),
      zipcode: async (value) => this.setZipCode(String(value ?? '')),
    };

    this.validateFormHandlers = {
      streetaddress: async (value) => this.validateStreetAddress(String(value ?? '')),
      city: async (value) => this.validateCity(String(value ?? '')),
      state: async (value) => this.validateState(String(value ?? '')),
      zipcode: async (value) => this.validateZipCode(String(value ?? '')),
    };
  }

  async getHeading(): Promise<string> {
    return (await this.heading.textContent()) ?? '';
  }

  async validateHeading(expectedValue: string, exactMatchRequired = false): Promise<void> {
    const matchType = exactMatchRequired ? 'exactly matches' : 'partially matches';
    this.eventLogger.addMessage(
      `Verify that the value '${expectedValue}' ${matchType} the element HEADING`
    );

    const actualValue = await this.getHeading();

    if (exactMatchRequired) {
      if (actualValue !== expectedValue) {
        throw new Error(
          `validateHeading: expected exact value "${expectedValue}" for "heading", but found "${actualValue}".`
        );
      }

      return;
    }

    if (!actualValue.includes(expectedValue)) {
      throw new Error(
        `validateHeading: expected "heading" to contain "${expectedValue}", but found "${actualValue}".`
      );
    }
  }

  async clickBackToHomeLink(): Promise<void> {
    await this.clickElement(this.backToHomeLink, 'back to home link');
  }

  async getStreetAddress(): Promise<string> {
    return this.getElementValue(this.streetAddressInput);
  }

  async setStreetAddress(newValue: string): Promise<void> {
    await this.setElementValue(this.streetAddressInput, newValue, 'street address');
  }

  async validateStreetAddress(expectedValue: string, exactMatchRequired = false): Promise<void> {
    await this.validateElementText(
      this.streetAddressInput,
      expectedValue,
      'street address',
      exactMatchRequired
    );
  }

  async getCity(): Promise<string> {
    return this.getElementValue(this.cityInput);
  }

  async setCity(newValue: string): Promise<void> {
    await this.setElementValue(this.cityInput, newValue, 'city');
  }

  async validateCity(expectedValue: string, exactMatchRequired = false): Promise<void> {
    await this.validateElementText(this.cityInput, expectedValue, 'city', exactMatchRequired);
  }

  async getState(): Promise<string> {
    return this.getElementValue(this.stateSelect);
  }

  async setState(newValue: string): Promise<void> {
    await this.setElementValue(this.stateSelect, newValue, 'state');
  }

  async validateState(expectedValue: string, exactMatchRequired = false): Promise<void> {
    await this.validateElementText(this.stateSelect, expectedValue, 'state', exactMatchRequired);
  }

  async getZipCode(): Promise<string> {
    return this.getElementValue(this.zipCodeInput);
  }

  async setZipCode(newValue: string): Promise<void> {
    await this.setElementValue(this.zipCodeInput, newValue, 'zip code');
  }

  async validateZipCode(expectedValue: string, exactMatchRequired = false): Promise<void> {
    await this.validateElementText(this.zipCodeInput, expectedValue, 'zip code', exactMatchRequired);
  }

  async clickSubmitAddressButton(): Promise<void> {
    await this.clickElement(this.submitAddressButton, 'submit address', 'button');
  }

  async clickClearAddressButton(): Promise<void> {
    await this.clickElement(this.clearAddressButton, 'clear address', 'button');
  }

  async getAddressMessage(): Promise<string> {
    return this.getElementValue(this.addressMessage);
  }

  async validateAddressMessage(expectedValue: string, exactMatchRequired = false): Promise<void> {
    await this.validateElementText(
      this.addressMessage,
      expectedValue,
      'address message',
      exactMatchRequired
    );
  }

  async fillForm(data: FormModel | null | undefined): Promise<void> {
    if (!data) {
      return;
    }

    for (const [rawKey, value] of Object.entries(data)) {
      const handler = this.fillFormHandlers[rawKey.toLowerCase()];
      if (!handler) {
        continue;
      }

      await handler(value);
    }
  }

  async validateForm(expected: FormModel | null | undefined): Promise<void> {
    if (!expected) {
      return;
    }

    for (const [rawKey, value] of Object.entries(expected)) {
      const validator = this.validateFormHandlers[rawKey.toLowerCase()];
      if (!validator) {
        continue;
      }

      await validator(value);
    }
  }
}

export default AddressFormPage;