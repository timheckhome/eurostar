import { test } from '../code/framework/TestBase';
import AddressFormPage from './PO_example';

async function testSetup(): Promise<void> {
  // put additional setup code here
}

test.describe('Address Form', () => {
  test.beforeEach(async () => {
    await testSetup();
  });

  test('Enter street address', async ({ page, eventLogger }) => {
    eventLogger.addNarrative('Populate only the street address field.');
    const addressFormPage = new AddressFormPage(page, eventLogger);
    await addressFormPage.setStreetAddress('123 tim street');
  });

  test('Populate all fields and submit', async ({ page, eventLogger }) => {
    eventLogger.addNarrative('Populate all address fields and submit the form.');
    const addressFormPage = new AddressFormPage(page, eventLogger);
    await addressFormPage.setStreetAddress('456 example avenue');
    await addressFormPage.setCity('New York');
    await addressFormPage.setState('New York');
    await addressFormPage.setZipCode('10001');
    await addressFormPage.clickOkButton();
    await addressFormPage.validateValidationMessage('Form submitted successfully!', true);
  });
});
