// cypress/e2e/addressForm.spec.js
import ui from './locatorObject';

function createTestObject(overrides = {}) {
  return {
    streetAddress: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    ...overrides
  };
}

describe('Address Form Tests', () => {
  beforeEach(() => {
    cy.visit('/addressForm.html'); // Assuming the page is served at this URL
  });

  it('should submit form successfully', () => {
    const data = createTestObject();
    cy.fillForm('addressForm', data);
    cy.get(ui.addressForm.okButton).click();
    cy.validateForm('addressForm', data);
    cy.get(ui.addressForm.validationMessages).should('contain', 'Form submitted successfully'); // Assuming success message
    // More validations...
  });

  it('should show validation errors for empty fields', () => {
    const data = createTestObject({ streetAddress: '', city: '', state: '', zipCode: '' });
    cy.fillForm('addressForm', data);
    cy.get(ui.addressForm.okButton).click();
    cy.get(ui.addressForm.validationMessages).should('be.visible');
    // Assuming validation messages appear
  });

  it('should handle partial data filling', () => {
    const partialData = createTestObject({ city: 'New City' });
    cy.fillForm('addressForm', partialData);
    cy.get(ui.addressForm.city).should('have.value', 'New City');
    // Other fields remain as is or empty
  });
});