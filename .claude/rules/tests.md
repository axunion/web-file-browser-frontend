---
description: テスト作成・編集のガイドライン
globs: src/**/*.test.*
---

# テストルール

## フレームワーク
- **Vitest** + **@testing-library/react**
- テストファイルはソースファイルと同じディレクトリに配置（例: `src/components/Foo.tsx` → `src/components/Foo.test.tsx`）

## 記述パターン

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

- `describe` / `it` パターンを使用（`test()` は使用しない）
- ネストした `describe` で状態・条件を整理する

## fetch のモック

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

- `global.fetch` を `vi.fn()` でモック
- `mockResolvedValueOnce` で個別のレスポンスを設定

## アサーション
- `@testing-library` のクエリ（`getByRole`, `getByText` 等）を優先
- `getByTestId` は最終手段
