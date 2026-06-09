import { Locator, Page } from '@playwright/test';
import { EventLogger } from '../framework/EventLogger';
import POBase from '../framework/POBase';

export class IndexPage extends POBase {
  private readonly selectors = {
    heading: 'h1',
    quickSearchInput: '#quickSearchInput',
    quickSearchButton: '#quickSearchButton',
    homeMessage: '#homeMessage',
    navAddress: '#navAddress',
    navProfile: '#navProfile',
    navNewsletter: '#navNewsletter',
    navSupport: '#navSupport',
  } as const;

  private readonly heading: Locator;
  private readonly quickSearchInput: Locator;
  private readonly quickSearchButton: Locator;
  private readonly homeMessage: Locator;
  private readonly navAddress: Locator;
  private readonly navProfile: Locator;
  private readonly navNewsletter: Locator;
  private readonly navSupport: Locator;

  constructor(page: Page, eventLogger: EventLogger) {
    super(page, eventLogger);

    this.heading = page.locator(this.selectors.heading);
    this.quickSearchInput = page.locator(this.selectors.quickSearchInput);
    this.quickSearchButton = page.locator(this.selectors.quickSearchButton);
    this.homeMessage = page.locator(this.selectors.homeMessage);
    this.navAddress = page.locator(this.selectors.navAddress);
    this.navProfile = page.locator(this.selectors.navProfile);
    this.navNewsletter = page.locator(this.selectors.navNewsletter);
    this.navSupport = page.locator(this.selectors.navSupport);
  }

  async getHeading(): Promise<string> {
    return this.getElementValue(this.heading);
  }

  async validateHeading(expectedValue: string, exactMatchRequired = false): Promise<void> {
    await this.validateElementText(this.heading, expectedValue, 'heading', exactMatchRequired);
  }

  async getQuickSearch(): Promise<string> {
    return this.getElementValue(this.quickSearchInput);
  }

  async setQuickSearch(newValue: string): Promise<void> {
    await this.setElementValue(this.quickSearchInput, newValue, 'quick search');
  }

  async validateQuickSearch(expectedValue: string, exactMatchRequired = false): Promise<void> {
    await this.validateElementText(
      this.quickSearchInput,
      expectedValue,
      'quick search',
      exactMatchRequired
    );
  }

  async clickQuickSearchButton(): Promise<void> {
    await this.clickElement(this.quickSearchButton, 'quick search', 'button');
  }

  async getHomeMessage(): Promise<string> {
    return this.getElementValue(this.homeMessage);
  }

  async validateHomeMessage(expectedValue: string, exactMatchRequired = false): Promise<void> {
    await this.validateElementText(this.homeMessage, expectedValue, 'home message', exactMatchRequired);
  }

  async clickAddressCollectionLink(): Promise<void> {
    await this.clickElement(this.navAddress, 'address collection link');
  }

  async clickProfileSetupLink(): Promise<void> {
    await this.clickElement(this.navProfile, 'profile setup link');
  }

  async clickNewsletterSignupLink(): Promise<void> {
    await this.clickElement(this.navNewsletter, 'newsletter signup link');
  }

  async clickSupportRequestLink(): Promise<void> {
    await this.clickElement(this.navSupport, 'support request link');
  }
}

export default IndexPage;
