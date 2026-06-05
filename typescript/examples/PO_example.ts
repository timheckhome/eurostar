import { Locator, Page } from '@playwright/test';
import { EventLogger } from '../code/framework/EventLogger';
import POBase from './PO_base';

export class AddressFormPage extends POBase {

  // Keeping selectors in one place makes the page object easier to maintain
  // and gives tests readable names instead of repeating raw CSS everywhere.
  readonly selectors = {
    heading: 'h1',
    streetAddressInput: '#streetAddress',
    cityInput: '#city',
    stateSelect: '#state',
    zipCodeInput: '#zipCode',
    okButton: '#okButton',
    cancelButton: '#cancelButton',
    validationMessages: '#validationMessages',
  } as const;

  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly zipCodeInput: Locator;
  readonly okButton: Locator;
  readonly cancelButton: Locator;
  readonly validationMessages: Locator;

  constructor(page: Page, eventLogger: EventLogger) {
    super(page, eventLogger);
    this.streetAddressInput = page.locator(this.selectors.streetAddressInput);
    this.cityInput = page.locator(this.selectors.cityInput);
    this.stateSelect = page.locator(this.selectors.stateSelect);
    this.zipCodeInput = page.locator(this.selectors.zipCodeInput);
    this.okButton = page.locator(this.selectors.okButton);
    this.cancelButton = page.locator(this.selectors.cancelButton);
    this.validationMessages = page.locator(this.selectors.validationMessages);
  }

  // Read-only elements expose getters only.
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

  // For selects, setElementValue matches by visible display text.
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
}

export default AddressFormPage;