# CLAUDE.md — Web File Browser Frontend

## Language Policy
- **Conversation**: Japanese
- **Code, comments, and commit messages**: English (Conventional Commits format)
- **User-facing UI messages**: Japanese (use the `MESSAGES` constant in `src/constants/messages.ts`)
- **Config files** (`.claude/`): English

## Project Overview
Web file browser frontend (React 19 + TypeScript 5.9 + Vite 7).

- **Package manager**: pnpm (do not use npm or yarn)
- **Node version**: Pinned to 24.12.0 via Volta

## Essential Commands

```bash
pnpm dev          # Start development server
pnpm build        # Type check + build
pnpm check:write  # Biome format & lint fix
pnpm test:run     # Run tests (no watch)
```

## Architectural Decisions (do not change or suggest alternatives)

| Decision | Details |
|---|---|
| Routing | Hash-based (`window.location.hash`). React Router is not needed — do not suggest it |
| Server state | SWR. Redux / Zustand are not needed — do not suggest them |
| Component structure | Flat (`src/components/` root). Do not nest into subdirectories |
| Biome config | Use default settings. `biome.json` does not exist — do not create it |
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
- Indent with tabs (per `.editorconfig`)
- Follow Biome default rules

## Detailed Guidelines
Context-specific rules are in `.claude/rules/`.
