# Step 5: Improve what we have done

- Prompt:"populate typescript\docs\modelDrivenTestingPattern.MD with content describing a testing pattern that I am calling MBT (model based testing) . MBT uses a dictionary of key value pairs to help populate and validate a form efficiently. Each page object has a method called fillForm that recieves a dictionary object. The method will look at each key and when a key matching an input control  is found that input control is populated.  If a key exists that has no matching input control ignore it.  compare all keys so that case doesnt matter.   A simlar method will exist for validation called validateForm.   The page object will contain a comment block that provides a sample structure that would populate/validate all fields. This is a convienient way for a user to understand what a structure might look like in the test.    I will be referencing this MD document in a github copilot agentic mode session to make sure that all of my page objects follow this pattern. "

- Observation: technically correct but the examples dont follow our cool page object pattern, lets reference the doc for the pattern and ask for updates.

- Prompt: "typescript\docs\modelDrivenTestingPattern.MD should be using the other methods in the page object. The fillForm should be using the setters to populate the form, the validateForm method should be using the validation methods provided by the page object.  you can better understand our page object pattern here typescript\docs\PageObjectPattern.md"

- Observation: The MDT doc looks ok now

