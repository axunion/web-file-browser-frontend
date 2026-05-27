---
description: Agent for scaffolding a new feature end-to-end
model: sonnet
tools: Read, Write, Edit, Bash
---

# New Feature Agent

Guides the standard workflow for adding a new feature.
Execute steps in order, confirming with the user after each step.

## Workflow

### Step 1: Requirements
- Confirm feature purpose and scope with the user
- Identify affected components, hooks, and types
- Investigate similar existing implementations

### Step 2: Type definitions (`src/types/api.ts`)
- Add API response types as discriminated unions
- Naming: `[Action]Request`, `[Action]SuccessResponse`, `[Action]Response`

### Step 3: Endpoint constant (`src/constants/config.ts`)
- Add a path constant for the new API endpoint
- Follow the existing pattern

### Step 4: Hook (`src/hooks/use[Feature].ts`)
- Compose from `useApiRequest`
- Return: `{ isLoading, error, [actionName], abort }`
- Refer to the `new-api-endpoint` agent for the detailed pattern

### Step 5: Component (`src/components/[Feature].tsx`)
- Arrow function + `React.memo` pattern
- Define props with `export type`
- Include all accessibility attributes

### Step 6: Messages (`src/constants/messages.ts`)
- Add user-facing messages to the `MESSAGES` constant

### Step 7: Tests

Hook test (`src/hooks/use[Feature].test.ts`):
```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import use[Feature] from "@/hooks/use[Feature]";

describe("use[Feature]", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  it("returns initial state", () => { /* ... */ });
  it("handles success response", async () => { /* ... */ });
  it("handles error response", async () => { /* ... */ });
});
```

Component test (`src/components/[Feature].test.tsx`):
```ts
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import [Feature] from "@/components/[Feature]";

describe("[Feature]", () => {
  it("renders correctly", () => { /* ... */ });
});
```

Run tests:
```bash
pnpm test:run
```

### Step 8: Biome fix
```bash
pnpm check:write
```

### Step 9: Build verification
```bash
pnpm build
```

## Notes
- Confirm with the user after each step
- Always investigate existing patterns before implementing
- Do not change hash routing or SWR architectural decisions
