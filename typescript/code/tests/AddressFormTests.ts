import { Page } from '@playwright/test';
import { test } from '../framework/TestBase';
import { EventLogger } from '../framework/EventLogger';
import AddressFormPage from '../pages/AddressFormPage';
import IndexPage from '../pages/IndexPage';

type AddressFormModel = Record<string, unknown>;

const validAddressModel: AddressFormModel = {
  streetAddress: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'California',
  zipCode: '90210',
};

const missingZipCodeModel: AddressFormModel = {
  streetAddress: '1600 Pennsylvania Avenue NW',
  city: 'Washington',
  state: 'New York',
};

async function testSetup(page: Page, eventLogger: EventLogger): Promise<void> {
  const indexPage = new IndexPage(page, eventLogger);
  await indexPage.clickAddressCollectionLink();
}

test.describe('Address Form MBT Tests', () => {
  test.beforeEach(async ({ page, eventLogger }) => {
    await testSetup(page, eventLogger);
  });

  test('Validate MBT can fill and validate all fields with real-looking values', async ({
    page,
    eventLogger,
  }) => {
    eventLogger.addNarrative(
      'Use MBT payload to fill all address fields on the Address Collection page, then validate the same fields from the UI.'
    );

    const addressFormPage = new AddressFormPage(page, eventLogger);

    await addressFormPage.validateHeading('Address Collection', true);
    await addressFormPage.fillForm(validAddressModel);
    await addressFormPage.validateForm(validAddressModel);
  });

  test('Validate success message is shown when all fields are filled and submit is pressed', async ({
    page,
    eventLogger,
  }) => {
    eventLogger.addNarrative(
      'Fill all required fields from MBT model, submit the address form, and verify success feedback.'
    );

    const addressFormPage = new AddressFormPage(page, eventLogger);

    await addressFormPage.fillForm(validAddressModel);
    await addressFormPage.clickSubmitAddressButton();
    await addressFormPage.validateAddressMessage('Address saved successfully.', true);
  });

  test('Validate failure message is shown when zip code is not filled and submit is pressed', async ({
    page,
    eventLogger,
  }) => {
    eventLogger.addNarrative(
      'Submit the address form without zip code and verify failure feedback is displayed.'
    );

    const addressFormPage = new AddressFormPage(page, eventLogger);

    await addressFormPage.fillForm(missingZipCodeModel);
    await addressFormPage.validateForm(missingZipCodeModel);
    await addressFormPage.clickSubmitAddressButton();
    await addressFormPage.validateAddressMessage('Please complete all address fields.', true);
  });
});