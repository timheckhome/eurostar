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
    streetAddressInput: '#streetAddress',
    cityInput: '#city',
    stateSelect: '#state',
    zipCodeInput: '#zipCode',
    okButton: '#okButton',
    cancelButton: '#cancelButton',
    validationMessages: '#validationMessages',
  } as const;

  private readonly streetAddressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateSelect: Locator;
  private readonly zipCodeInput: Locator;
  private readonly okButton: Locator;
  private readonly cancelButton: Locator;
  private readonly validationMessages: Locator;
  private readonly fillFormHandlers: Record<string, (value: unknown) => Promise<void>>;
  private readonly validateFormHandlers: Record<string, (value: unknown) => Promise<void>>;

  constructor(page: Page, eventLogger: EventLogger) {
    super(page, eventLogger);
    this.streetAddressInput = page.locator(this.selectors.streetAddressInput);
    this.cityInput = page.locator(this.selectors.cityInput);
    this.stateSelect = page.locator(this.selectors.stateSelect);
    this.zipCodeInput = page.locator(this.selectors.zipCodeInput);
    this.okButton = page.locator(this.selectors.okButton);
    this.cancelButton = page.locator(this.selectors.cancelButton);
    this.validationMessages = page.locator(this.selectors.validationMessages);

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

  async getHeadingText(): Promise<string> {
    return (await this.page.locator(this.selectors.heading).textContent()) ?? '';
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

  async clickOkButton(): Promise<void> {
    await this.clickElement(this.okButton, 'ok', 'button');
  }

  async clickCancelButton(): Promise<void> {
    await this.clickElement(this.cancelButton, 'cancel', 'button');
  }

  async getValidationMessage(): Promise<string> {
    return (await this.validationMessages.textContent()) ?? '';
  }

  async validateValidationMessage(expectedValue: string, exactMatchRequired = false): Promise<void> {
    await this.validateElementText(
      this.validationMessages,
      expectedValue,
      'validation message',
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