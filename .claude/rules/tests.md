---
description: Guidelines for creating and editing tests
globs: src/**/*.test.*
---

# Test Rules

- **Vitest** + **@testing-library/react**; colocate tests with source
  (`src/components/Foo.tsx` → `src/components/Foo.test.tsx`).
- `describe` / `it` — never `test()`. Group states/conditions with nested `describe`.
- Prefer role/text queries (`getByRole`, `getByText`); `getByTestId` only as a last
  resort. Use `userEvent.setup()` for interactions.
- Tests are self-contained: no shared mutable state; reset with `vi.clearAllMocks()`
  in `beforeEach` when mocks are involved.

## Mocking fetch

```ts
beforeEach(() => {
  global.fetch = vi.fn();
});

it("POSTs the payload to the endpoint", async () => {
  vi.mocked(global.fetch).mockResolvedValueOnce(
    new Response(JSON.stringify({ status: "success" }), { status: 200 }),
  );

  const { result } = renderHook(() => useRenameFile());
  await act(async () => {
    await result.current.renameFile({ path: "", name: "a", newName: "b" });
  });

  const [url, options] = vi.mocked(global.fetch).mock.calls[0];
  // assert on url and the URLSearchParams / FormData body
});
```

- Hooks: `renderHook` + `act`; assert on the actual request (URL, body entries), not
  just the returned state — see `src/hooks/apiHooks.test.ts` for the reference pattern.
