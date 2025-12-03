# Remove AI code slop

**CRITICAL: Before making any changes, thoroughly study the entire codebase and ALL relevant files. Understand the existing patterns, architecture, coding style, and conventions. Only proceed once you have a complete understanding of how the codebase works.**

Check the diff against main, and remove all AI generated slop introduced in this branch. 

This includes:
- Extra comments that a human wouldn't add or is inconsistent with the rest of the file
- Extra defensive checks or try/catch blocks that are abnormal for that area of the codebase (especially if called by trusted / validated codepaths)
- Casts to any to get around type issues
- Over-engineering: unnecessary abstractions, wrappers, or layers that don't exist elsewhere
- Duplicating existing functionality instead of reusing what's already there
- Not following existing patterns (e.g., blueprint structure, import style, naming conventions)
- Adding unnecessary dependencies or imports
- Magic numbers/strings instead of using existing constants or configuration
- Debug code left in: console.log/print statements, test endpoints, temporary variables
- Unnecessary validation when data is already validated upstream
- Breaking existing patterns or conventions
- Adding features that weren't requested
- Inconsistent naming with the rest of the codebase
- Not following the project's file structure conventions
- Over-commenting obvious code or under-commenting complex logic (inconsistent with file style)
- Not checking if similar functionality already exists before adding new code
- Any other style that is inconsistent with the file

Report at the end with only a 1-3 sentence summary of what you changed. Be very very precise and specific. 