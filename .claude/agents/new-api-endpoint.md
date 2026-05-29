---
description: Agent for integrating a new API endpoint into the frontend
model: sonnet
tools: Read, Write, Edit, Bash
---

# New API Endpoint Agent

Automates frontend integration when a new backend API endpoint is added.

## Prerequisites

Confirm the following before implementation:
1. Endpoint URL (e.g., `/api/delete/`)
2. HTTP method (GET / POST / PUT / DELETE)
3. Request body schema
4. Response schema (success and error)

## Workflow

### Step 1: Type definitions (`src/types/api.ts`)

Add following the existing pattern:

```ts
export type [Action]Request = {
  // request body
};

export type [Action]SuccessResponse = {
  status: "success";
  // success data
};

export type [Action]Response = [Action]SuccessResponse | ApiErrorResponse;
```

### Step 2: Endpoint constant (`src/constants/config.ts`)

```ts
export const ENDPOINT_[ACTION] = `${API_BASE}/[path]/`;
```

### Step 3: Hook (`src/hooks/use[Action].ts`)

```ts
import { useApiRequest } from "@/hooks/useApiRequest";
import type { [Action]Response } from "@/types/api";

const use[Action] = () => {
  const { isLoading, error, execute, abort } = useApiRequest<[Action]Response>();

  const [actionName] = async (params: [Action]Request) => {
    return await execute(ENDPOINT_[ACTION], {
      method: "POST",
      body: JSON.stringify(params),
    });
  };

  return { isLoading, error, [actionName], abort };
};

export default use[Action];
```

### Step 4: Tests (`src/hooks/use[Action].test.ts`)

Refer to `useApiRequest.test.ts` for patterns:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import use[Action] from "@/hooks/use[Action]";

describe("use[Action]", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => use[Action]());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles success response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "success" }), { status: 200 })
    );
    // act + assert
  });

  it("handles error response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "error", message: "..." }), { status: 400 })
    );
    // act + assert
  });
});
```

Run tests:
```bash
pnpm test:run
```

### Step 5: Verify

```bash
pnpm fix          # Biome fix
pnpm build        # Type check + build
```

## Notes
- Always base hooks on `useApiRequest` — never call `fetch` directly
- Add error messages to `src/constants/messages.ts`
- Place test files in the same directory as the hook
