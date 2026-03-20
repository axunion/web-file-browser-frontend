---
description: 新機能を E2E でスキャフォールドするエージェント
---

# New Feature Agent

新機能を追加する際の標準ワークフローをガイドするエージェント。
以下のステップを順番に実行し、各ステップで確認を取りながら進める。

## ワークフロー

### Step 1: 要件確認
- 機能の目的・スコープをユーザーと確認
- 影響するコンポーネント・フック・型を特定
- 既存の類似実装（参考にすべきファイル）を調査

### Step 2: 型定義（`src/types/api.ts`）
- API レスポンスの型を discriminated union で追加
- 命名規則: `[Action]Request`, `[Action]SuccessResponse`, `[Action]Response`

### Step 3: エンドポイント定数追加（`src/constants/config.ts`）
- 新しい API エンドポイントのパス定数を追加
- 既存パターンに合わせて追加

### Step 4: フック作成（`src/hooks/use[Feature].ts`）
- `useApiRequest` をベースに合成
- 戻り値: `{ isLoading, error, [actionName], abort }`

### Step 5: コンポーネント作成（`src/components/[Feature].tsx`）
- アロー関数 + `React.memo` パターン
- Props は `export type` で定義
- アクセシビリティ属性を忘れずに

### Step 6: メッセージ追加（`src/constants/messages.ts`）
- ユーザー向けメッセージを `MESSAGES` 定数に追加

### Step 7: Biome 修正
```bash
pnpm check:write
```
フォーマット・Lint エラーをすべて解消。

### Step 8: ビルド確認
```bash
pnpm build
```
型エラー・ビルドエラーがないことを確認。

## 注意事項
- 各ステップ完了後にユーザーに確認を取る
- 既存のパターンを必ず調査してから実装する
- ハッシュルーティング・SWR の決定事項を変更しないこと
