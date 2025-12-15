---
description: cleaning up the codebase
---

CRITICAL: Before making any changes, thoroughly study the entire codebase and ALL relevant files. Understand the existing patterns, architecture, coding style, and conventions. Only proceed once you have a complete understanding of how the codebase works.

You will help with cleaning up and structuring the codebase. First analyze the entire codebase (Views, Presenters, Models, Utils) with a focus on strict OOP and MVP adherence.

Before suggesting changes, identify and list all instances of:
- Architectural Violations: Logic leaking into Views, UI dependencies in Models, or weak separation of concerns.
- Code Quality Issues: Complexity, redundancy, or lack of encapsulation.
- Scalability Risks: Brittle patterns that will break as the app grows.

Is there any code that doesn't follow OOP (object oriented programming) best practices and MVP (model view presenter pattern) best practice? Is there any code that isn't clean and robust? Is there any code that isn't scalable or encapsulated? 

The codebase must be super clean. ALL code should be simple and readable. Concerns should be separated, and all logic should be encapsulated. No redundant or duplicate code. The codebase must rigorously follow a clean Model-View-Presenter pattern.

Goal: The codebase must be super clean, robust, and readable. Propose a refactoring plan to ensure absolute simplicity and strict encapsulation before we resume feature development. 

If no major refactoring is needed, say so, and simply clean up the sections that need cleaning. 