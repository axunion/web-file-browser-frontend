# CLAUDE.md — Web File Browser Frontend

## Approach

- **Change scope.** Deliver what was asked, at the scope intended. Don't "improve"
  adjacent code, comments, or formatting, and don't add unrequested features,
  abstractions, or configurability. If the request seems mistaken or a better approach
  exists, say so in a sentence and continue as asked.
- **Dead code.** Delete code your own change makes unused; never leave it commented
  out. Point out pre-existing dead code, but don't delete, split, or refactor it
  unless asked.
- **Implementation size.** Extract a helper only when it's used in 3+ places;
  otherwise inline it. Don't write error handling for cases that can't happen.
- **Ambiguity.** Make routine judgment calls yourself. When different readings of the
  request would lead to materially different work, present the options instead of
  picking one.

## Language

Default to the user's language for everything interactive — chat replies, plan-mode
proposals, clarifying questions, and any other back-and-forth during the session.

Switch to English only for durable artifacts: things other people or tools will read
after the session ends — in-code comments, commit messages, console/log/error output,
AI-readable instruction files, and reader-facing docs (README and the like). Scratch
notes and other throwaway dev artifacts stay in the user's language.

## Architectural Decisions (do not change or suggest alternatives)

- **Routing**: hash-based (`window.location.hash`); no React Router.
- **State**: SWR for server state; no Redux / Zustand.
- **Components**: flat under `src/components/`; no subdirectories.

## Code Conventions

- Use pnpm only (not npm or yarn).
- Use `type`, never `interface`.
- One concern per file; split when a file exceeds ~300 lines.

## Testing

- When changing code behavior, write tests before or alongside the implementation —
  they are your success criteria.
- Test observable outcomes and edge cases, not implementation details.
- Each test is fully self-contained; no shared mutable state between tests.
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

## Commits

Format — plain prose, no prefixes or labels (`feat:`, `fix:`, and the like):

```
<summary: imperative mood, ≤70 chars, no trailing period>

<motivation: one sentence, only when not evident from the diff>

- <change bullets: only for 2+ distinct changes>
```

- Never commit secrets (`*.key`, `*.pem`, `credentials*`).
- Never use `--no-verify`. Use `--amend` only when explicitly asked; default to a new
  commit.
