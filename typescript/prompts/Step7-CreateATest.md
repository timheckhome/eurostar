- Prompt: "Create a test file called "typescript\code\tests\AddressFormTests.ts" that uses the page object "typescript\code\pages\AddressFormPage.ts" to implement the following tests using  the MBT pattern described here typescript\prompts\Step4B-MoveTheBaseClassesToTheFrameworkFolder.md. 1) Validate that I can use MBT to fill and validate all fields with real looking values.  2) Validate that when all fields are filled and submit is pressed that a cuccess message is shown.  3) validate that when the zipcode is not filled a failure message is shown. "

- Observation: Looks nice but all tests are failing in setup and that's a bummer.  Let's have AI help bail us out. 

- Prompt: "when I run the tests they all fail in setup"

- Observation: This was left intentionally vauge for demonstration purposes.... look how things got off the rails as it guessed what I wanted and was very wrong... It fixed the SUT, and it made figuring out where the SUT was more complex.  See how I adjust things and bring it back on track

- Prompt: Do not change the AddressForm. html as that is representing the system under tests as we will not be able to change that.  Put the full physical path to the initial page in whatever location is natuaral for a playwright typescript implementation.  In a C# nunit project I would probably use .runsettings, I'm not sure what it is called in typescript but I want the root url stored in a settings file/location. 




