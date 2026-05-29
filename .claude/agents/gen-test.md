---
description: Agent for generating tests for existing components and hooks
model: sonnet
tools: Read, Write, Edit, Bash
---

# Gen Test Agent

Generates test files for existing components or hooks.

## Prerequisites

1. Path of the file to test (e.g., `src/components/FileItem.tsx`)
2. Overview of behaviors / scenarios to cover

## Workflow

### Step 1: Review existing tests

Check similar test patterns for reference:
- `src/hooks/useApiRequest.test.ts` — fetch mock pattern
- `src/hooks/useFileList.test.ts` — SWR hook test
- `src/hooks/useImageUpload.test.ts` — upload hook test
- `src/App.test.tsx` — component test

### Step 2: Analyze the target file

- Check Props / argument types (`src/types/api.ts`)
- Understand state management complexity (useState / useReducer)
- Identify external dependencies (fetch, SWR, custom hooks)
- List the main use cases to cover

### Step 3: Create the test file

Place test files in the same directory as the source:
- `src/components/Xxx.tsx` → `src/components/Xxx.test.tsx`
- `src/hooks/useXxx.ts` → `src/hooks/useXxx.test.ts`

#### Component test template

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Xxx from "@/components/Xxx";

describe("Xxx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<Xxx />);
    expect(screen.getByRole("...")).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Xxx onAction={onAction} />);
    await user.click(screen.getByRole("button", { name: "..." }));
    expect(onAction).toHaveBeenCalledOnce();
  });
});
```

#### Hook test template

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useXxx from "@/hooks/useXxx";

describe("useXxx", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    vi.clearAllMocks();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => useXxx());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles success response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "success" }), { status: 200 })
    );
    const { result } = renderHook(() => useXxx());
    await act(async () => {
      await result.current.[actionName](/* params */);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles error response", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ status: "error", message: "Error" }), { status: 400 })
    );
    const { result } = renderHook(() => useXxx());
    await act(async () => {
      await result.current.[actionName](/* params */);
    });
    expect(result.current.error).toBe("Error");
  });
});
```

### Step 4: Run tests and fix

```bash
pnpm test:run
```

Fix any failures based on the error output.

### Step 5: Biome fix

```bash
pnpm fix
```

## Notes
- Prefer `getByRole`, `getByText` queries; use `getByTestId` only as a last resort
- Use `describe` / `it` pattern — never `test()`
- Confirm all tests pass before finishing
- Reset mocks in `beforeEach` with `vi.clearAllMocks()`
