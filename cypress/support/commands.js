// cypress/support/commands.js
import ui from '../e2e/locatorObject';

// Custom command to fill form fields
Cypress.Commands.add('fillForm', (pageName, data) => {
  const pageLocators = ui[pageName];

  if (!pageLocators) {
    throw new Error(`Page "${pageName}" not found in locator object`);
  }

  Object.keys(data).forEach(key => {
    if (pageLocators[key]) {
      cy.get(pageLocators[key]).clear().type(data[key]);
    } else {
      cy.log(`Warning: Field "${key}" not found in locator object for page "${pageName}"`);
    }
  });
});

// Custom command to validate form fields
Cypress.Commands.add('validateForm', (pageName, data) => {
  const pageLocators = ui[pageName];

  if (!pageLocators) {
    throw new Error(`Page "${pageName}" not found in locator object`);
  }

  Object.keys(data).forEach(key => {
    if (pageLocators[key]) {
      cy.get(pageLocators[key]).should('have.value', data[key]);
    } else {
      cy.log(`Warning: Field "${key}" not found in locator object for page "${pageName}"`);
    }
  });
});