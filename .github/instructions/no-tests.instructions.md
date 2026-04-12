---
description: "Use when adding features, creating components, modifying services, or making any code changes in this project. Enforces a no-test policy: never generate or modify test files."
applyTo: "**"
---

# No Tests Policy

This project does not use automated testing. Follow these rules on every task:

- **Never create** `*.spec.ts`, `*.test.ts`, `*.spec.js`, or `*.test.js` files.
- **Never modify** existing test files. If one exists and is mentioned, leave it unchanged.
- **Do not add** `TestBed`, `describe`, `it`, `expect`, `vi`, `jest`, `vitest`, or any other testing imports, utilities, or configuration.
- **Do not install** testing-only packages (`@testing-library/*`, `vitest`, `jest`, `karma`, etc.).
- **Skip the tests step** in any multi-step plan. Do not include test coverage as a verification step.
- When implementing a feature, validate correctness by running the app or checking compile errors — not tests.
