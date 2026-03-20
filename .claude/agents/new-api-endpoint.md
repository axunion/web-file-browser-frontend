---
description: 新しい API エンドポイントを統合するエージェント
---

# New API Endpoint Agent

バックエンドに新しい API エンドポイントを追加した際のフロントエンド統合を自動化するエージェント。

## 前提情報の収集

実装前に以下を確認する:
1. エンドポイント URL（例: `/api/delete/`）
2. HTTP メソッド（GET / POST / PUT / DELETE）
3. リクエストボディのスキーマ
4. レスポンスのスキーマ（成功・エラー）

## ワークフロー

### Step 1: 型定義（`src/types/api.ts`）

既存のパターンを参照して追加:

```ts
export type [Action]Request = {
  // リクエストボディ
};

export type [Action]SuccessResponse = {
  status: "success";
  // 成功時のデータ
};

export type [Action]Response = [Action]SuccessResponse | ApiErrorResponse;
```

### Step 2: エンドポイント定数（`src/constants/config.ts`）

```ts
export const ENDPOINT_[ACTION] = `${API_BASE}/[path]/`;
```

### Step 3: フック作成（`src/hooks/use[Action].ts`）

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

### Step 4: 検証

```bash
pnpm check:write  # Biome 修正
pnpm build        # 型チェック + ビルド
```

## 注意事項
- `useApiRequest` を必ずベースにすること（直接 `fetch` を呼ばない）
- エラーメッセージは `src/constants/messages.ts` に追加
