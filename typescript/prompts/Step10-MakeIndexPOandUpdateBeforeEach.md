- Prompt: "create a page object for the page html\SUT_ForDemo\index.html following the doumentation found here typescript\docs\PageObjectPattern.md . make the output in the directory typescript\code\pages and call it IndexPage.ts"

- Prompt: "update #sym:testSetup  so it navigates to the address page by clicking the address collection link using the #sym:clickAddressCollectionLink  method on the index page. "

- Prompt: "update playwrightconfig so it the intialpageurl is index.html"

- Observation: Whoops, all tests seem broken... what did I miss? Oh, when I changed this code from the single page address_form to html\SUT_ForDemo\address-collection.html it regenerated it a little differently. AI is gonna AI right? I'm going to have to update the page object to point at the new page. 

- Prompt: "update typescript\code\pages\AddressFormPage.ts so that it represnts html\SUT_ForDemo\address-collection.html following the patterns described here typescript\docs\PageObjectPattern.md. when complete modify the tests in typescript\code\tests\AddressFormTests.ts to use the new properties and methods."

- Observation: Interesting that ALL tests pass now, I was expecting one to fail like in the past but when AI generated the bigger SUT it must have fixed the problem (IN THE SUT) that was making our tests fail.  

- Actual manual code edit: I made the form submit even with missing field values. And now one test fails like we wanted. 