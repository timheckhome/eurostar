Now that we have tests and I see one fail it's clear that I can do better with failures

- Prompt: "Improve the logging for failing tests.  When I look at the event logs I cant tell what failed.   Add a method called "addFailure" to typescript\code\framework\EventLogger.ts and adjust the #sym:renderEvent to render the failure output in red text.  Add a second method to EventLogger that puts a stacktrace in the rendered output.  Adjust typescript\code\framework\TestBase.ts so that when any error is thrown a call to addFailure is made with the text "the test failed" and follow that message with a stack trace."

- Prompt: (pulled out of response): "make the stack trace block red-tinted (background/border) so failures are even easier to spot visually."

- Prompt: "when a test fails adjust the filename to help it stand out in the the event log files.  Add a prefix of "_failure_" to the MD file created by eventlog"