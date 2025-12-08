CRITICAL INSTRUCTIONS:

Study Phase: before coding, explicitly analyze the existing Model-View-Presenter (MVP) structure. study the codebase very, very thoroughly. see how all of the logic related together. map how your changes will fit into the current architecture without breaking encapsulation.

Simplicity Check: if the implementation requires complex logic, you are likely doing it wrong. stop and find a simpler, cleaner approach.

Strict OOP: use rigorous encapsulation. No leaked logic between layers.

Execution: implement the feature using the minimum amount of code necessary. readable code is better than clever code. always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules down below at Code Implementation Guidelines. if you think there might not be a correct answer, you say so. if you do not know the answer, say so, instead of guessing.

Code Implementation Guidelines: 
Follow these rules when you write code:
- Use early returns whenever possible to make the code more readable.
- Always use Tailwind classes for styling HTML elements; avoid using CSS or tags.
- Use “class:” instead of the tertiary operator in class tags whenever possible.
- Use descriptive variable and function/const names. Follow the naming conventions already applied in the codebase.

note that it seems any file that uses hooks, event handlers, browser APIs, or state management needs 'use client' at the top. 