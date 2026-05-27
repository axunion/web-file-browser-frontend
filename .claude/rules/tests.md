---
description: Guidelines for creating and editing tests
globs: src/**/*.test.*
---

# Test Rules

## Framework
- **Vitest** + **@testing-library/react**
- Place test files in the same directory as source files (e.g., `src/components/Foo.tsx` → `src/components/Foo.test.tsx`)

## Pattern

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ComponentName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does something", async () => {
    // arrange
    // act
    // assert
  });
});
```

- Use `describe` / `it` pattern — never `test()`
- Organize conditions and states with nested `describe`

## Mocking fetch

```ts
beforeEach(() => {
  global.fetch = vi.fn();
});

it("calls API", async () => {
  vi.mocked(global.fetch).mockResolvedValueOnce(
    new Response(JSON.stringify({ status: "success" }), { status: 200 })
  );
  // ...
});
```

- Mock `global.fetch` with `vi.fn()`
- Set individual responses with `mockResolvedValueOnce`

## Assertions
- Prefer `@testing-library` queries (`getByRole`, `getByText`, etc.)
- Use `getByTestId` only as a last resort
