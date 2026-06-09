# Step 1: Define What Good Looks Like

- Prompt: "Create an example typescript page object that I can use as a template for a test automation presentation.  The new file should be called \"PO_example.ts\" and created in the directory typescript\examples . The page object should represent the page html\SUT_ForDemo\address-collection.html"
- Observation: It read the rest of the repo and followed patterns from another example. Now let's tell AI not to do that anymore.

- Prompt: "I am working on a new isolated example for typescript. ignore everything outside of the typescript folder and just create a normal looking traditional feel typescript page object that any typescript tester would understand. Add narrative comments where appropriate since this is an example that will be referenced later."
- Observation: There were unexpected types at the top of the file because it put too much importance on this being a standalone example. We likely want AI to understand that Playwright is installed so we do not have to fight this repeatedly and we can test our work in progress. Now let's install Playwright and clean up some of the noise.

- Prompt: "install playwright and add remove the page and locator constructs from this file"
- Observation: Things are getting close to what I wanted in my page object. Now let's move the data model to its own file.

- Prompt: "move the AddressFormData structure to it's own file in the  typescript\examples\dataModels folder"
- Observation: Better. Now let's tuck a base class under our page object example.

- Prompt: "create another file in typescript\code\framework called POBase.ts and have typescript\examples\PO_example.ts inherit from that class. Add one method called \"setFieldValue\" that accepts a Locator and string description but dont worry about the implementation yet."
- Observation: Great. Now let's put some meat in the base class sandwich. Now let's make some methods that make Playwright easier for humans and for AI.

- Prompt: "in typescript\code\framework\POBase.ts implement the setFieldValue method.  Add a new parameter to this method that takes a string called \"newValue\" as the second parameter.  When given a locator, the menthod should figure out what type of element is being found and use the appropriate playwright interactions to populate that field with the newValue value.  I want it to support common elements such as input controls, text areas, and select controls.  For select lists I want the method to select the element whos matching *display* matches the newValue.  If the locator resolves to an unsupported element type throw an error."

- Prompt: "add another method that gets the value of an element with the signature getElementValue(locator)"

- Prompt: "add a third method called \"clickElement\" that accepts a locator and a string descriptor.  When the method is called locate and click the element after writing to the console \"Click the SOMETHING button\" where the descriptor is capitalized and the element type is derived from the locator tagname"

- Prompt: " There are times when the element that you are clicking on renders like something else (example: a span looks like a button through CSS tricks\") . add an optional third parameter of type string to the clickElement method that allows the caller to override the tagname in the log message."
- Observation: That base class sandwich is getting pretty good. Now let's make the example page use these methods for the getters and setters for all fields.

- Prompt: " update typescript\examples\PO_example.ts to use the methods in typescript\code\framework\POBase.ts that wrap playwright . Create getters and setters methods for all locators as appropriate.  Read only elements do not need setters.  Buttons need click methods but they dont need getters and setters.  Remove exiting methods that ovelap these new getter,setter and click methods"
- Observation: It looks great, but I would prefer to keep my locators private. If locators are out of page objects, it is possible to use these tests in a non-Playwright system someday. Also, setField and getElement feel clumsy, and we should facilitate reading spans, divs, and li elements.

- Prompt: " rename the setFieldValue method to be setElementValue and update all references."

- Prompt: "expand the getElementValue method to include spans, div, and li elements"

- Prompt: "update typescript\code\framework\POBase.ts and add a method that returns a bool called validateElementText that validates that some text is in a locator.  The parameters should be (field: Locator, expectedValue: string, description: string, exactMatchRequired?: bool)  if the exactMatchRequired parameter is omitted the value is assumed false.  If exactMatchRequired is false or omitted then the method should return true if the element contains the string. If exactMatchRequired is true then the function only returns true when the element value contains the exact expectedValue.  Before the assertion is made please write to the console \"Verify that the value 'expectedValue' is in the element DESCRIPTOR\" where descriptor is the uppercase value of the  description  value"

- Prompt: "make the logging more descriptive so it mentions if the match expectation was exact or partial."

- Prompt: "Add similar logging to the set method like there is in the clickElement method and validate method"
- Observation: That is a pretty good base class. Let's adjust the page to use the functionality in the base.

- Prompt: "update typescript\examples\PO_example.ts and remove all of the methods starting with expect.  for every field that has a getter and setter method (exclude button elements) add a method that validates that the value in the field matches a value passed into the method. For example \"validateState(\"NY\") will validate that the state field contains the value NY.  Use the  #sym:validateElementText  in the base class."

- Prompt: "add a similar method to validate the ValidationMessage field"
- Observation: That is a pretty good page object pattern. Let's make a test.

- Prompt: " create a new file in typescript\examples called TEST_example.ts that is a simple test that starts playwright, opens the file  html\SUT_ForDemo\address-collection.html in a browser and enters the value \"123 tim street\" in the address line. No validation is needed at this time."
- Observation: Since we did not tell it to do otherwise, it is ignoring our page object that we just made.

- Prompt: "refactor the test to use the page object typescript\examples\PO_example.ts"
- Observation: It looks good, but I need to run them easily.

- Prompt: "add scripts to package.json to run the tests in debug mode and normal execution"
- Observation: They run. Now let's make the test better and cleaner.

- Prompt: "Create a base class for the test TestBase.ts that includes lifecyle hooks.  Before each test is executed collect some settings (the base URL) and spin up a new browser.  have the test inherit from this new base class and remove code that is already done in the base test"

- Prompt: "Add a second test to typescript\examples\TEST_example.ts . the test should populate all fields and click submit."

- Prompt: "In the populate all fields test add a validation step confirming that the validation message is   \"Form submitted successfully!\""

- Prompt: " add empty methods and call them for the additional lifecycle hooks \"before all tests are run\" and \"after all tests are run\""
- Observation: The validation can still be smoother.

- Prompt: "update #sym:validateElementText so that it doesnt return a boolean it returns nothing.  If the expectation fails just let the exception bubble up."
- Observation: Let's move some of this stuff to the base.

- Prompt: " remove the #sym:openAddressForm  method and move things to the base test.  A new browser should be started for each test. the path to the opening page can be calculated once before all tests."
- Observation: The code is looking pretty tight, but it smells funny. This is such an odd implementation that I am going to double-check that it is cool.

- Prompt: "this feels like a very unusual way to run tests. Doesnt playwright have a test runner to make things feel a little more nunit?"
- Observation: A big shift is needed. I am happy to catch it now so I do not make a lot of similar tests and pages.

- Prompt: " I want this to look more normal for a typical person familiar to playwright.  Refactor into using playwright test runner."

- Prompt: "it looks like TEST_Base is no longer used.  Can we move the lifecycle hooks into that base so all tests have the same foundation?"
- Observation: That was not what I expected. The methods were left in the test.

- Prompt: "can #sym:beforeAll  and #sym:beforeEach be moved into the TestBase?"
- Observation: Resistance is futile.

- Prompt: "move the navigation out of the base form and into the base test"
