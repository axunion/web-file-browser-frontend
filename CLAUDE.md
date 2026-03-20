# CLAUDE.md — Web File Browser Frontend

## 言語ポリシー
- **会話**: 日本語
- **コード・コメント・コミットメッセージ**: 英語（Conventional Commits 形式）
- **UI ユーザー向けメッセージ**: 日本語（`src/constants/messages.ts` の `MESSAGES` 定数を使用）

## プロジェクト概要
Web ファイルブラウザのフロントエンド（React 19 + TypeScript 5.9 + Vite 7）。

- **パッケージマネージャ**: pnpm（npm / yarn は使用不可）
- **Node バージョン**: Volta で 24.12.0 に固定

## 必須コマンド

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # 型チェック + ビルド
pnpm check:write  # Biome フォーマット & Lint 修正
pnpm test:run     # テスト実行（ウォッチなし）
```

## アーキテクチャ上の決定事項（変更・提案しないこと）

| 決定事項 | 詳細 |
|---|---|
| ルーティング | ハッシュベース（`window.location.hash`）。React Router は不要 — 提案しないこと |
| サーバー状態管理 | SWR を使用。Redux / Zustand は不要 — 提案しないこと |
| コンポーネント構造 | フラット（`src/components/` 直下）。サブフォルダへのネストは行わない |
| Biome 設定 | デフォルト設定を使用。`biome.json` は存在しない — 作成しないこと |
| パスエイリアス | `@/` → `src/` |

## コード規約

### TypeScript
- `interface` 禁止 — `type` のみ使用
- `any` 型禁止
- Props は `export type XxxProps = { ... }` で定義

### コンポーネント
- アロー関数 + `React.memo` パターン
- default export（コンポーネント・フック）、named export（型・定数）

### エラーメッセージ
- ユーザー向け表示は `src/constants/messages.ts` の `MESSAGES` 定数から参照

### フォーマット
- インデント: タブ（`.editorconfig` 準拠）
- Biome のデフォルトルールに従う

## 詳細ガイドライン
詳細なパターン・規則は `.github/copilot-instructions.md` を参照。
コンテキスト別のルールは `.claude/rules/` 以下を参照。
