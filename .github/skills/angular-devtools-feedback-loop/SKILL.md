---
name: angular-devtools-feedback-loop
description: 'Run a development feedback loop for Angular UI changes using a live app and Chrome DevTools MCP. Use when iterating on frontend behavior, validating UX, checking console/network errors, or confirming fixes on localhost:4200.'
argument-hint: 'Describe the page, feature, and what feedback you need from the live app (UI, console, network, accessibility, or performance).'
user-invocable: true
---

# Angular DevTools Feedback Loop

Use this skill to validate in-progress Angular UI work against the actual running app, not static code assumptions.

## When To Use

- You are actively developing an Angular feature and need real browser feedback.
- You need quick validation of behavior, layout, console output, network activity, or accessibility.
- You want a repeatable inspect-fix-verify cycle while `npm start` is running.

## Inputs To Collect First

- Target route or page (for example, `/gallery`).
- Expected behavior and acceptance checks.
- What to inspect first: UI state, console errors, network requests, AXE/accessibility, or performance.

## Procedure

1. Confirm whether the Angular dev server is reachable at `http://localhost:4200`.
2. If the app is running, open/select the page with Chrome DevTools MCP and take a fresh page snapshot.
3. Validate visible UI structure and key interactions against the requested behavior.
4. Inspect browser console messages and classify them as blocking/non-blocking.
5. Inspect relevant network requests (especially failed XHR/fetch calls) and capture status code plus payload clues.
6. If asked for quality checks, run a Lighthouse accessibility audit and summarize actionable issues.
7. Map observed issues back to likely source files/components and implement focused code edits.
8. Re-check the live page after each meaningful fix; repeat until acceptance checks pass.
9. End by reporting: what was verified, what was fixed, what remains uncertain, and explicit follow-up steps.

## Decision Points

- If localhost:4200 is unavailable:
  - Start the Angular dev server (`npm start`) or ask permission to start it.
  - Retry the page open once the server is ready.
- If the page loads but content is unexpected:
  - Confirm route, feature flags, and required seed/auth state.
  - Use snapshot + console + network together before editing code.
- If there are no errors but behavior is still wrong:
  - Reproduce with explicit interaction steps and compare expected vs actual state transitions.
- If multiple defects appear:
  - Prioritize: runtime errors first, broken data flow second, visual polish last.

## Completion Criteria

- Target route and core interaction path were tested on the running app.
- No unresolved blocking console errors tied to the changed flow.
- Critical network calls for the flow succeed or have documented root causes.
- Requested UX/accessibility checks were performed and summarized.
- Final report includes reproducible steps and any residual risks.

## Output Format

- Scope tested (route + scenario)
- Findings (ordered by severity)
- Fixes applied (with file references)
- Verification evidence (snapshot/console/network/a11y)
- Remaining risks and next actions
