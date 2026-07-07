# CLAUDE.md — Web File Browser Frontend

## Language Policy
- **Conversation**: Japanese
- **Code, comments, and commit messages**: English (Conventional Commits format)
- **User-facing UI messages**: Japanese (use the `MESSAGES` constant in `src/constants/messages.ts`)
- **Config files** (`.claude/`): English

## Project Overview
Web file browser frontend (React 19 + TypeScript 5.9 + Vite 8).

- **Package manager**: pnpm (do not use npm or yarn)
- **Node version**: ^24 (pinned via `.node-version`) / pnpm 11.9.0 — specified via `devEngines` in `package.json` (onFail: download)

## Essential Commands

```bash
pnpm dev          # Start development server
pnpm build        # Type check + build
pnpm typecheck    # Type check only (tsc --noEmit)
pnpm fix          # Biome format & lint fix
pnpm test:run     # Run tests (no watch)
```

> **pre-commit hook**: lefthook runs `pnpm fix` (Biome) and `pnpm typecheck` automatically on staged files before every commit.

## Architectural Decisions (do not change or suggest alternatives)

| Decision | Details |
|---|---|
| Routing | Hash-based (`window.location.hash`). React Router is not needed — do not suggest it |
| Server state | SWR. Redux / Zustand are not needed — do not suggest them |
| Component structure | Flat (`src/components/` root). Do not nest into subdirectories |
| Biome config | Configured via `biome.json` (formatter: 2-space indent, double quotes; linter: recommended preset; import organization on). Scope is the whole repo (`biome check .`), not just `src` |
| Path alias | `@/` → `src/` |

## Code Conventions

### TypeScript
- No `interface` — use `type` only
- No `any` type
- Props defined as `export type XxxProps = { ... }`

### Components
- Arrow function + `React.memo` pattern
- default export (components and hooks), named export (types and constants)

### Error Messages
- User-facing messages must reference the `MESSAGES` constant in `src/constants/messages.ts`

### Formatting
- Indent with 2 spaces (per `.editorconfig` and `biome.json`)
- Follow Biome default rules

## Detailed Guidelines
Context-specific rules are in `.claude/rules/`.
