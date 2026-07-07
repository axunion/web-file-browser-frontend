# AGENTS.md — Web File Browser Frontend

> **Sync note**: This file is kept in sync with `CLAUDE.md`. If you update one, apply the
> same change to the other.

Behavioral defaults plus house conventions. Bias toward caution over speed; on trivial
tasks, use judgment.

## Approach

- **Think before coding.** State assumptions; if uncertain, ask. When multiple
  interpretations exist, surface them rather than silently picking one. If a simpler path
  exists, say so and push back when warranted.
- **Simplest thing that works.** Write the minimum code that solves the stated problem —
  nothing speculative. No unasked-for abstractions, flexibility, or error handling for
  impossible cases. If 200 lines could be 50, rewrite it.
- **Surgical changes.** Every changed line should trace to the request. Don't refactor,
  reformat, or "improve" adjacent code that isn't broken; match the surrounding style.
  Remove only the imports and symbols your change orphaned; leave unrelated dead code alone
  and mention it.
- **Goal-driven.** Turn each task into a verifiable outcome ("fix the bug" → "write a
  failing test that reproduces it, then make it pass"). For multi-step work, state a brief
  plan with a verification check per step, then loop until it passes.

## Language

Write in **English only**: code, in-code comments, commit messages, console output, error
and log messages, and AI-readable config files (CLAUDE.md, `.claude/`, etc.).

Exceptions:

- **Conversation with the user**: Japanese
- **User-facing UI messages**: Japanese — always via the `MESSAGES` constant in
  `src/constants/messages.ts`

## Project Overview

Web file browser frontend (React 19 + TypeScript 5.9 + Vite 8).

- **Package manager**: pnpm (do not use npm or yarn)
- **Node version**: ^24 (pinned via `.node-version`) / pnpm 11.9.0 — specified via
  `devEngines` in `package.json` (onFail: download)

## Essential Commands

```bash
pnpm dev          # Start development server
pnpm build        # Type check + build
pnpm typecheck    # Type check only (tsc --noEmit)
pnpm fix          # Biome format & lint fix
pnpm test:run     # Run tests (no watch)
```

## Architectural Decisions (do not change or suggest alternatives)

| Decision | Details |
|---|---|
| Routing | Hash-based (`window.location.hash`). React Router is not needed — do not suggest it |
| Server state | SWR. Redux / Zustand are not needed — do not suggest them |
| Component structure | Flat (`src/components/` root). Do not nest into subdirectories |
| Biome config | Configured via `biome.json` (formatter: 2-space indent, double quotes; linter: recommended preset; import organization on). Scope is the whole repo (`biome check .`), not just `src` |
| Path alias | `@/` → `src/` |

## Code Structure

- Name variables, functions, and files to communicate intent.
- One concern per file; split when a file exceeds ~300 lines.
- Extract a helper only when used in 3+ places; otherwise inline it.
- Delete dead code you create; never comment it out.

## Code Conventions

### TypeScript
- No `interface` — use `type` only
- No `any` type
- Props defined as `export type XxxProps = { ... }`

### Components
- Arrow function components; `React.memo` only where re-renders are hot (see `.claude/rules/components.md`)
- default export (components and hooks), named export (types and constants)

### Formatting
- Indent with 2 spaces (per `.editorconfig` and `biome.json`)
- Follow Biome default rules

## Testing

- Write tests before or alongside implementation — they are your success criteria.
- Test observable outcomes and edge cases, not implementation details.
- Each test is fully self-contained; no shared mutable state between tests.

## Commits

Format:

```
<one-line summary>

<Why: one sentence — motivation or problem>

- <change 1>
- <change 2>
```

- Summary: imperative mood, ≤70 chars, no trailing period, no prefix tags (`feat:`, `fix:`, etc.).
- Why line: include only when motivation is not evident from the diff alone.
- Bullets: include only for 2+ distinct changes.
- Never commit secrets (`*.key`, `*.pem`, `credentials*`).
- Never use `--no-verify` or `--amend`; always create a new commit.

> **pre-commit hook**: lefthook runs `pnpm fix` (Biome) and `pnpm typecheck` automatically
> on staged files before every commit.

## Detailed Guidelines

Context-specific rules are in `.claude/rules/`.
