# AI_INSTRUCTIONS.md

AIによる自動生成・修正・提案の際に従うべきガイドラインです。

## プロジェクト概要
Web File Browser Frontend - ファイルブラウザのフロントエンドアプリケーション

## 使用技術
- React 19
- TypeScript
- Vite
- SWR
- Tailwind CSS
- Biome
- @iconify/react

## ディレクトリ構造
```
src/
├── components/     # 再利用可能なUIコンポーネント
├── hooks/         # カスタムReactフック
├── types/         # TypeScript型定義
├── utils/         # ユーティリティ関数
└── constants/     # 定数・設定値
```

## 基本方針
- 既存の設計・スタイル・命名規則を尊重し、統一感を保つこと。
- 最新のベストプラクティス（公式推奨・コミュニティ標準）に従うこと。
- シンプルさを最優先し、不要な複雑化や抽象化は避けること。
- 既存の依存パッケージやツールを優先的に利用すること。
- ファイルの編集や追加を行う際は、最初に綿密かつ適切な計画を立て、方針を確認しながらステップを踏んで進めること。
- 無闇にファイルを追加せず、必要なファイルのみを適切なディレクトリに配置することを徹底する。
- 必要に応じて本ファイルにルールを追加すること。

## コーディング規約
- TypeScriptの型安全性を最大限活用すること
- React 19の新機能（Server Components、Suspense等）を適切に使用すること
- カスタムフックは `use` プレフィックスで命名すること
- コンポーネントはPascalCase、ファイル名も一致させること
- 関数型コンポーネントを使用し、`function` 宣言よりもアロー関数を優先すること

## スタイリング
- Tailwind CSSを使用し、カスタムCSSは最小限に留めること
- レスポンシブデザインを考慮すること
- アクセシビリティ（a11y）を意識したマークアップを行うこと

## 状態管理
- ローカル状態は `useState` を使用
- サーバー状態は SWR を使用
- 複雑な状態は `useReducer` を検討

## エラーハンドリング
- APIエラーは適切にキャッチし、ユーザーフレンドリーなメッセージを表示すること
- Error Boundariesを適切に配置すること
- 開発時はconsole.errorでログ出力すること

## パフォーマンス
- 不要な再レンダリングを避けるため、適切にメモ化（memo, useMemo, useCallback）を使用すること
- 大きなリストには仮想化を検討すること
- 画像の最適化（WebP、適切なサイズ）を行うこと

## テスト（将来的に追加予定）
- ユニットテストはJest + React Testing Libraryを使用
- E2EテストはPlaywrightを使用予定
- テストカバレッジは80%以上を目標

## コメント
- 作業履歴や自明な内容（例: "increment count"）のコメントは不要。
- 必要な場合のみ、適切な英語で簡潔に記述すること。
- 複雑なビジネスロジックには説明コメントを追加すること。

## コミットメッセージ
- 英語で簡潔に、何を・なぜ行ったかを明記すること。
- Conventional Commits形式を推奨: `type(scope): description`
- 例: `feat(upload): add drag and drop file upload`、`fix(list): resolve infinite scroll issue`
