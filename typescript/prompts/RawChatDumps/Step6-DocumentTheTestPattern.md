User: 

Create a document in typescript\docs called TestConstructionPattern.md that describes the testing pattern that we have implemented in typescript\examples\TEST_example.ts .  I will be using this document as instructions for humans and also for github copilot agentic mode.   All tests should inherit from  typescript\code\framework\TestBase.ts which provides some basic functionality such as lifecycle hooks.  Each test file contains one describe block with one or more tests.   Since many test will have the need for a common setup that extends the beforeEach lifecyclehook in the testbase , please add a method to each test file that simply has the comment "put additional setup code here" that can be populated later by the coders.  The new method should be named "testSetup" and be called immediately after the lifecycle hook in the base class completes. 

GitHub Copilot: I’m going to inspect the current test base and example test implementation, then I’ll create the new pattern document and update the example to include the `testSetup` hook call right after base lifecycle setup.

Read [](file:///c%3A/Repos/eurostar/typescript/examples/TEST_example.ts)

Read [](file:///c%3A/Repos/eurostar/typescript/code/framework/TestBase.ts)

Read [](file:///c%3A/Repos/eurostar/typescript/docs/PageObjectPattern.md)

I found the current pattern in the example and base classes; next I’ll add a file-level `testSetup` hook to the example test and then create the new pattern guide in the docs folder with explicit rules for future test files.

Generating patch (19 lines) in [](file:///c%3A/Repos/eurostar/typescript/examples/TEST_example.ts)


```

```
I’m now creating the new markdown document with a concrete, reusable template for test construction, including the one-describe rule and the required `testSetup` extension hook pattern.

Created [](file:///c%3A/Repos/eurostar/typescript/docs/TestConstructionPattern.md)

Generating patch (102 lines) in [](file:///c%3A/Repos/eurostar/typescript/docs/TestConstructionPattern.md)


```

```
I’ve applied both changes; next I’ll quickly validate the edited files for syntax/type issues so the new pattern doc and test hook are ready to use immediately.

Checked [](file:///c%3A/Repos/eurostar/typescript/examples/TEST_example.ts), [](file:///c%3A/Repos/eurostar/typescript/docs/TestConstructionPattern.md), no problems found

Implemented exactly what you requested.

Changes made:
- Added the new guidance document at TestConstructionPattern.md.
- Updated the example test file at TEST_example.ts to include:
1. A file-level method named testSetup.
2. The required comment inside it: "put additional setup code here".
3. A file-level beforeEach hook that calls testSetup, so it runs after the base lifecycle setup from TestBase.

What the new document now enforces:
- All test files must use TestBase.
- Each test file contains exactly one describe block.
- Each describe block contains one or more tests.
- Each test file must define testSetup and call it from file-level beforeEach as the extension point for additional setup.

Validation:
- Checked both updated files for errors; no issues were reported.

If you want, I can next apply this same testSetup pattern to any existing files under tests once those test files are in place.

Made changes.