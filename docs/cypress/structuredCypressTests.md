# Structured Cypress Tests: Form Filling and Validation Pattern

## Overview

This document describes a pattern for creating structured, maintainable Cypress tests using custom commands that automate form filling and validation. The pattern leverages a centralized locator object (as described in `storingLocators.md`) and data-driven structures to populate or validate form fields dynamically.

## Pattern: Data-Driven Form Interactions

### Core Concept

Instead of hardcoding field interactions in tests, use custom Cypress commands that accept a data object. The command iterates through the object's keys, matching them to field locators from the centralized UI object. This approach:

- **Decouples data from logic**: Test data is separate from interaction code
- **Improves maintainability**: Changes to field mappings require updates in one place
- **Enhances readability**: Tests focus on what data to use, not how to interact
- **Provides validation**: Warns when data keys don't match available fields

### Implementation Components

1. **Centralized Locators**: UI object from `locatorObject.js` (see `storingLocators.md`)
2. **Custom Commands**: `cy.fillForm()` and `cy.validateForm()`
3. **Data Structures**: Plain JavaScript objects with field names as keys

## Custom Commands Implementation

### Setup

Add these commands to your `cypress/support/commands.js` file:

```javascript
// cypress/support/commands.js
import ui from '../../output/cypress/locatorObject';

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
```

### Command Descriptions

#### `cy.fillForm(pageName, data)`

**Purpose**: Populates form fields with data from a structured object.

**Parameters**:
- `pageName` (string): The key in the UI locator object corresponding to the page/section
- `data` (object): Key-value pairs where keys match field names in the locator object

**Behavior**:
- Clears existing content and types the new value for each matching field
- Logs a warning for any data keys that don't have corresponding locators
- Throws an error if the specified page doesn't exist in the locator object

**Example Usage**:
```javascript
const userData = {
  firstNameField: 'John',
  lastNameField: 'Doe',
  emailField: 'john.doe@example.com'
};

cy.fillForm('userProfile', userData);
```

#### `cy.validateForm(pageName, data)`

**Purpose**: Validates that form fields contain expected values.

**Parameters**:
- `pageName` (string): The key in the UI locator object corresponding to the page/section
- `data` (object): Key-value pairs where keys match field names and values are expected field contents

**Behavior**:
- Checks that each matching field has the expected value
- Logs a warning for any data keys that don't have corresponding locators
- Throws an error if the specified page doesn't exist in the locator object

**Example Usage**:
```javascript
const expectedData = {
  firstNameField: 'John',
  lastNameField: 'Doe',
  emailField: 'john.doe@example.com'
};

cy.validateForm('userProfile', expectedData);
```

## Test Implementation Example

```javascript
// cypress/integration/userProfile.spec.js
import ui from '../output/cypress/locatorObject';

describe('User Profile Management', () => {
  beforeEach(() => {
    cy.visit('/profile');
  });

  it('should update user profile successfully', () => {
    const testData = {
      firstNameField: 'Jane',
      lastNameField: 'Smith',
      emailField: 'jane.smith@newemail.com'
    };

    // Fill the form
    cy.fillForm('userProfile', testData);
    
    // Submit the form
    cy.get(ui.userProfile.saveButton).click();
    
    // Validate the updated values
    cy.validateForm('userProfile', testData);
    
    // Additional validations
    cy.get(ui.userProfile.successMessage).should('be.visible');
  });

  it('should validate form with partial data', () => {
    const partialData = {
      firstNameField: 'Bob',
      // Note: lastNameField and emailField are not included
      phoneField: '123-456-7890'  // This will generate a warning if not in locator object
    };

    cy.fillForm('userProfile', partialData);
    // Warning will be logged for 'phoneField' if it doesn't exist
  });
});
```

## Locator Object Requirements

Ensure your `locatorObject.js` follows this structure:

```javascript
const ui = {
  userProfile: {
    firstNameField: '#first-name',
    lastNameField: '#last-name',
    emailField: '#email',
    saveButton: '[data-cy="save-btn"]',
    successMessage: '.success-msg'
  },
  // Other pages...
};

export default ui;
```

## Best Practices

1. **Consistent Naming**: Use the same key names in data objects and locator objects
2. **Page Context**: Always specify the correct `pageName` to ensure proper locator resolution
3. **Error Handling**: Monitor test logs for warnings about unmatched fields
4. **Data Validation**: Consider adding data type validation in custom commands if needed
5. **Test Data Management**: Store test data in separate files or fixtures for reusability

## Integration with GitHub Copilot Agents

When using GitHub Copilot agents for Cypress test generation:

1. **Provide Context**: Include this document and `storingLocators.md` as reference
2. **Data Structure Guidance**: Instruct agents to create data objects with keys matching locator object fields
3. **Command Usage**: Have agents use `cy.fillForm()` and `cy.validateForm()` instead of direct field interactions
4. **Warning Monitoring**: Ensure agents handle or document warnings for unmatched fields
5. **Page Name Specification**: Guide agents to use appropriate page names from the locator object

This pattern promotes structured, maintainable test automation that scales with your application's complexity.