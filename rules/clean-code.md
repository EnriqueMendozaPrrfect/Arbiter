# Clean Code Rules

## 1. General Principles

- **KISS (Keep It Simple, Stupid):** Avoid unnecessary complexity.
- **DRY (Don't Repeat Yourself):** Extract duplicated logic into reusable functions or components.
- **YAGNI (You Ain't Gonna Need It):** Don't implement features until they are actually needed.
- **Single Responsibility Principle (SRP):** Each class or function should have one responsibility.

## 2. Naming Conventions

- **Descriptive Names:** Use names that reveal intent (e.g., `daysSinceModification` vs `d`).
- **Consistent Case:**
  - `camelCase` for variables and functions.
  - `PascalCase` for classes and components.
  - `UPPER_SNAKE_CASE` for constants.
- **Boolean Variables:** Prefix with `is`, `has`, or `should` (e.g., `isValid`, `hasPermission`).

## 3. Functions

- **Small and Focused:** Functions should be small and do one thing well.
- **Limit Arguments:** Aim for 0-2 arguments. If more are needed, consider using an object.
- **Avoid Side Effects:** Functions should not modify global state unexpectedly.

## 4. Comments

- **Explain "Why", not "What":** Code should be self-documenting. Use comments to explain the reasoning behind complex decisions.
- **Remove Dead Code:** Don't comment out code; delete it. Git history will save it.

## 5. Error Handling

- **Fail Fast:** Validate inputs early and throw errors immediately.
- **Catch Specific Errors:** Avoid generic `try-catch` blocks where possible.
- **Meaningful Error Messages:** Provide context in error messages to aid debugging.

## 6. Testing

- **Unit Tests:** Write tests for individual functions and components.
- **Test Names:** Use descriptive names for tests (e.g., `should return true when input is valid`).
