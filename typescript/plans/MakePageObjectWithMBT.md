# Instructions for GitHub Copilot to Create a TypeScript Page Object with MBT

## Source of Truth
Use only these two documents:
- `typescript/docs/PageObjectPattern.md`
- `typescript/docs/modelDrivenTestingPattern.MD`

Do not inspect or infer patterns from any other repository files.

## Goal
Create a TypeScript page object that is fully compliant with both source documents above.

## Required Process
1. Read both source documents completely before generating code.
2. Ask for any missing inputs required to generate the page object (class name, supported fields/selectors, clickable elements, read-only fields, and route/navigation details if needed).
3. Generate the page object strictly from the documented rules.
4. If a needed behavior is not explicitly defined in the two documents, ask the user instead of guessing.

## Minimal Compliance Checks
Before finalizing, verify compliance against the two docs and explicitly confirm:
- Page object pattern requirements are satisfied.
- MBT requirements are satisfied, including `fillForm` and `validateForm` behavior.
- No rule was sourced from outside the two referenced documents.

## Output Format
Return:
- The full generated page object code.
- A brief assumptions section.
- A brief compliance confirmation that cites both source documents by path.
