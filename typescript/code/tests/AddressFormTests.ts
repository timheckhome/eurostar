import { test } from '../framework/TestBase';
import AddressFormPage from '../pages/AddressFormPage';

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

async function testSetup(): Promise<void> {
  // put additional setup code here
}

test.describe('Address Form MBT Tests', () => {
  test.beforeEach(async () => {
    await testSetup();
  });

  test('Validate MBT can fill and validate all fields with real-looking values', async ({
    page,
    eventLogger,
  }) => {
    eventLogger.addNarrative(
      'Use MBT payload to fill all address fields, then validate the same fields from the UI.'
    );

    const addressFormPage = new AddressFormPage(page, eventLogger);

    await addressFormPage.fillForm(validAddressModel);
    await addressFormPage.validateForm(validAddressModel);
  });

  test('Validate success message is shown when all fields are filled and submit is pressed', async ({
    page,
    eventLogger,
  }) => {
    eventLogger.addNarrative(
      'Fill all required fields from MBT model, submit with OK, and verify success feedback.'
    );

    const addressFormPage = new AddressFormPage(page, eventLogger);

    await addressFormPage.fillForm(validAddressModel);
    await addressFormPage.clickOkButton();
    await addressFormPage.validateValidationMessage('Form submitted successfully!', true);
  });

  test('Validate failure message is shown when zip code is not filled and submit is pressed', async ({
    page,
    eventLogger,
  }) => {
    eventLogger.addNarrative(
      'Submit the form without zip code and verify failure feedback is displayed.'
    );

    const addressFormPage = new AddressFormPage(page, eventLogger);

    await addressFormPage.fillForm(missingZipCodeModel);
    await addressFormPage.validateForm(missingZipCodeModel);
    await addressFormPage.clickOkButton();
    await addressFormPage.validateValidationMessage('Zip code is required.', true);
  });
});