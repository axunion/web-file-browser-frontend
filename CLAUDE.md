# CLAUDE.md — Web File Browser Frontend

## Architectural Decisions (do not change or suggest alternatives)

- **Routing**: hash-based (`window.location.hash`); no React Router.
- **State**: SWR for server state; no Redux / Zustand.
- **Components**: flat under `src/components/`; no subdirectories.

## Code Conventions

- Use pnpm only (not npm or yarn).
- Use `type`, never `interface`.
- One concern per file; split when a file exceeds ~300 lines.

## Testing

- Persist a test only for a flow worth protecting against regressions (ideally one that
  has broken before); a one-off check for a single change doesn't need to become a file.
  When unsure, ask.
- Visual judgment ("does this look right") stays a manual check of the running app;
  don't try to automate it.

## Subagents

The main conversation writes all code; agents only investigate or check work they
didn't write. A write agent would need every tool, lose context on each re-spawn, and
hand back a working tree rather than a summary — so there isn't one.

- **Trivial** (typos, one-line fixes, config tweaks): implement directly, no agents.
- **Contained** (a self-contained change in one area): implement directly, optionally
  after `Explore` (this codebase) or `researcher` (external library APIs). Then run
  `reviewer` and `tester` in parallel without asking.
- **Large, ambiguous, or high-risk** (many files, or substantial changes to
  `src/hooks/` or `src/utils/path.ts`): propose that the user run `/goal` with a
  condition like "implement X; done when reviewer reports no findings and tester
  passes". Each turn: `Explore` + `researcher` in parallel, implement, then `reviewer`
  + `tester` in parallel.
