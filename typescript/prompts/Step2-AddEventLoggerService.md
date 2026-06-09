# Step 2: Add EventLogger Service

- Prompt: "create a class that I can use to collect strings as a test executes. The class should be called EventLogger. There should be a method that accepts a string as a parameter called message. and when this method is called the class should take the message and store it in memory. When the test completes I'll call another message in this class called createDocument that takes the collection of messages from memory and creates an MD doc of all of the messages and the time that they were collected. the create document method will take a single parameter that is the path and filename for the MD doc that will be created. Create the class in typescript\code\framework. Follow traditional typescript best practices for this class"
- Observation: Event logger exists, but test/base ownership still needs to be adjusted.

- Prompt: "right now it looks like the base class is creating the page object. I would prefer to do that in my test to keep the base more generic"
- Observation: Base became more generic. Next, add lifecycle-driven navigation and shared logging access.

- Prompt: "create a beforeEach method in the base class and have that method do the actual navigation. also have this method start up an instance of typescript\code\framework\EventLogger.ts that can be referenced from any test. Add a call to Event logger at the top of every test that just logs a message describing what the test is doing."

- Prompt: "add an afterEach in TestBase.ts that automatically calls createDocument with a per-test markdown filename."

- Prompt: "Create a beforeAll method where we define the output folder (hardcoded root plus a time stamp for this suite execution) and simplify the result files names to be just the text in test.describe, a ~ character as a delimiter, and the name of the test. Put all MD docs in the folder created for this suite's execution."

- Prompt: "it seems like the typescript\test-results\event-logs folder always has only one subdirectory. My intent is to keep a history of all runs (each in their own subfolder)"
- Observation: Root cause was Playwright cleanup of test-results; moved Playwright output folder so event-log history is preserved.

- Prompt: "add an afterAll method and keep it empty for now."

- Prompt: "add a comment in afterAll that describes when it's called and how it can be used"

- Prompt: "refactor the log method in typescript\code\framework\EventLogger.ts to the name addMessage. Add another field to the object being pushed to event called enventType with the value message. Add another method called addNarrative that does the exact same thing as addMessage except it's eventType is narrative. It probably makes sense to make a private helper method to power both of these public methods."

- Prompt: "update #sym:createDocument with the following changes: when the event is a narrative type, use style in the MD document that makes a bordered box (ideally with a light background) that contains the message. The timestamp can be ignored. If the entry is a message type, render as an element in a list. Again, the date can be ignored"

{break for lunch… might not have reviewed the previous result}

- Observation: I’m going to take a peek at the output for validation…. HEY…Wait a minute…. Where are the steps in the output file? AI is stupid and unpredictable. Timmy is going to sound stupid for telling people to use AI.. I need to assume control and set things straight. {rolls up sleeves} 

- Prompt typed with clear dissapointment: "look at the generated output for a test run (typescript\test-results\event-logs\2026-06-05T17-28-20-302Z\Address Form~Populate all fields and submit.md) note that there are no entries and that there is no bounding rectangle as described"

- AI Response included: "The reason there is no bordered rectangle is that your test is calling addMessage, not addNarrative:
TEST_example.ts:9
In the current renderer, message events become list items, while only narrative events become boxed HTML blocks:
EventLogger.ts:49
There is also a second issue behind the “no entries” impression: only explicit EventLogger calls are written to the markdown file. The detailed actions like setting fields and clicking buttons are still going to console.log in POBase.ts, so they never reach EventLogger.”

- Prompt: "change the test to use addNarrative(...) for that top-level description. I want the step-by-step actions to appear in the markdown too. change the logging in POBase.ts through EventLogger instead of console.log."

- Observation: Timmy made a silly mistake. AI is correct. Thank god I didn’t embarrass myself to a human like that.  The next prompt will be delivered with my tail between my legs.

- Prompt: "change the test to use [addNarrative(...)](file:///c%3A/Repos/eurostar/typescript/code/framework/EventLogger.ts#17%2C10) for that top-level description. I want the step-by-step actions to appear in the markdown too. change the logging in [POBase.ts](file:///c%3A/Repos/eurostar/typescript/code/framework/POBase.ts) through EventLogger instead of [console.log](file:///c%3A/Repos/eurostar/typescript/node_modules/%40types/node/web-globals/console.d.ts#8%2C9)."