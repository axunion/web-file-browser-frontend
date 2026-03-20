---
description: コンポーネント作成・編集のガイドライン
globs: src/components/**
---

# コンポーネントルール

## 基本パターン

```tsx
import { memo } from "react";

export type XxxProps = {
  foo: string;
  bar?: number;
};

const Xxx = memo(({ foo, bar }: XxxProps) => {
  return <div>{foo}</div>;
});

export default Xxx;
```

- アロー関数 + `React.memo` を使用
- Props は `export type` で定義（`interface` 禁止）
- default export で export

## モーダル
- `src/components/Modal.tsx` のベースコンポーネントを使用
- 独自の overlay / backdrop を実装しないこと

## 状態管理
- 複雑な UI 状態（複数の状態が連動する場合）: `useReducer` + discriminated union を使用
- シンプルな状態: `useState` で十分

## アイコン
- `@iconify/react` の `Icon` コンポーネントで統一
- 他のアイコンライブラリを追加しないこと

## アクセシビリティ
- インタラクティブ要素には `aria-label` を付与
- キーボードハンドラ（`onKeyDown`）を必ず実装
- `role` 属性を適切に設定
