import { test } from './TEST_base';

test.describe('Address Form', () => {
  test('Enter street address', async ({ addressFormPage }) => {
    await addressFormPage.setStreetAddress('123 tim street');
  });

  test('Populate all fields and submit', async ({ addressFormPage }) => {
    await addressFormPage.setStreetAddress('456 example avenue');
    await addressFormPage.setCity('New York');
    await addressFormPage.setState('New York');
    await addressFormPage.setZipCode('10001');
    await addressFormPage.clickOkButton();
    await addressFormPage.validateValidationMessage('Form submitted successfully!', true);
  });
});
