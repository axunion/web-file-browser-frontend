---
description: 型定義作成・編集のガイドライン
globs: src/types/**
---

# 型定義ルール

## 基本方針
- `interface` 禁止 — `type` のみ使用
- `any` 型禁止（`unknown` を使用し、型ガードで絞る）
- named export で export

## API レスポンスの型パターン

API レスポンスは `status` フィールドによる discriminated union で定義する。

```ts
export type XxxSuccessResponse = {
  status: "success";
  // ... 成功時のデータ
};

export type XxxErrorResponse = {
  status: "error";
  message: string;
};

export type XxxResponse = XxxSuccessResponse | XxxErrorResponse;
```

## リクエスト型の命名規則

```
[Action]Request         → リクエストボディ（例: UploadRequest）
[Action]SuccessResponse → 成功レスポンス（例: UploadSuccessResponse）
[Action]Response        → ユニオン型（例: UploadResponse）
```

## 型ガードの実装

```ts
export const isSuccess = (res: XxxResponse): res is XxxSuccessResponse =>
  res.status === "success";
```

## その他
- `src/types/api.ts` に API 関連の型をまとめる
- コンポーネント固有の型はコンポーネントファイル内で定義して export
