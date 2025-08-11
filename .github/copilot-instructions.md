# Copilot Instructions

## プロジェクト概要
Webファイルブラウザ用のReact + TypeScript + Viteフロントエンドアプリケーション。バックエンドAPIからファイル・ディレクトリを表示し、ブラウジング、アップロード、基本的なファイル操作をサポート。データ取得にSWR、スタイリングにTailwind CSS v4を使用。

## 基本方針
- **既存コードの尊重**: 設計・スタイル・命名規則を保持し、統一感を維持
- **シンプルさ優先**: 不要な複雑化や抽象化を避け、最小限の実装で目的を達成
- **計画的な開発**: ファイル編集前に適切な計画を立て、段階的に進める
- **最新ベストプラクティス**: React 19、TypeScript、Tailwind CSS v4の推奨パターンを採用

## アーキテクチャ・データフロー
- **ハッシュベースルーティング**: ナビゲーション状態は`window.location.hash`で管理（`src/utils/path.ts`参照）
- **API通信**: 3つのエンドポイント - `/api/list/`、`/api/upload/`、`/api/rename/`（`src/constants/config.ts`で設定）
- **状態管理**: サーバー状態はSWR、ローカル状態はReactフックを使用
- **ファイル表示**: `VITE_ENDPOINT_DATA`ベースURLから直接ファイルを配信

## 言語使用方針
- **チャットでのやり取り**: 日本語
- **コミットメッセージ**: 英語（Conventional Commits形式）
- **コード内コメント**: 英語
- **console出力**: 英語
- **エラーメッセージ**: 日本語（ユーザー向け表示）

## 主要パターン・規則

### コンポーネント構造
- TypeScriptプロパティインターフェースでアロー関数を使用: `const Component = ({ prop }: Props) => {}`
- ファイル命名: コンポーネント名と一致するPascalCase（例: `FileItem.tsx`）
- インポート順序: 外部ライブラリ → `@/`エイリアスを使った内部パス → 型定義
- React 19機能の活用: Server Components、Suspenseを適切に使用

### TypeScript規約
- 型安全性を最大限活用し、`any`型の使用を避ける
- プロパティインターフェースは明示的に定義（例: `FileItemProps`）
- ユニオン型でAPIレスポンスの状態を表現（`src/types/api.ts`参照）

### パフォーマンス最適化
- `memo`、`useMemo`、`useCallback`で不要な再レンダリングを防止
- 大きなリストでは仮想化を検討
- 画像最適化（WebP、適切なサイズ）を実装

### 環境設定
`.env`で必要な環境変数:
```
VITE_ENDPOINT_API=http://localhost:8000/api/
VITE_ENDPOINT_DATA=http://localhost:8000/data/
```
起動時に設定検証を実行（`src/constants/config.ts`参照）

### ナビゲーションシステム
- パス状態: `getPath()`が`{ path: string, paths: string[] }`を返す
- ナビゲーション: ドリルダウンは`appendPath(name)`、戻る・進むはハッシュ変更イベント
- パンくずリスト: パス状態の`paths`配列から構築

### ファイルタイプ処理
`getFileType()`ユーティリティ（`src/utils/fileType.ts`）で拡張子による分類:
- `image`、`video`、`audio`タイプは直接メディア要素でレンダリング
- `text`、`pdf`タイプは専用アイコン表示
- その他は汎用ファイルアイコンにフォールバック

### スタイリングアプローチ
- テーマ用CSS変数を使ったTailwind CSS v4
- 背景ぼかし付き固定ヘッダー・フッター: `bg-(--background-color)/50 backdrop-blur-lg`
- レスポンシブグリッドレイアウト: `grid-cols-3 sm:grid-cols-4 md:grid-cols-6...`
- `@iconify/react`による一貫したサイズのアイコン
- アクセシビリティを考慮したマークアップ（適切なARIAラベル、キーボードナビゲーション）

### 状態管理パターン
- **ローカル状態**: `useState`を使用、複雑な場合は`useReducer`を検討
- **サーバー状態**: SWRによるキャッシュ・再取得管理
- **カスタムフック**: データ操作ロジックを抽象化（`use`プレフィックス）

### エラーハンドリング
- APIエラーは`ErrorModal`コンポーネントで日本語メッセージを表示
- `MESSAGES`定数でユーザー向けメッセージを管理
- 開発時は英語でconsole.errorログを出力

## 開発ワークフロー
- **開発サーバー**: `npm run dev`（ポート5173）
- **コード品質**: Biomeによるフォーマット・リント（`npm run check:write`）
- **ビルド**: `npm run build`（TypeScriptチェック + Viteビルド）
- **型チェック**: アプリとNode.js用の個別設定でStrict TypeScript

## コーディング指針
- **コメント**: 複雑なビジネスロジックのみ英語で簡潔に記述、自明な内容は不要
- **コミットメッセージ**: Conventional Commits形式で英語（例: `feat(upload): add drag and drop support`）
- **ファイル追加**: 必要最小限のファイルを適切なディレクトリに配置
- **依存関係**: 既存パッケージを優先利用し、新規追加は慎重に検討

## よくある作業
- **新APIエンドポイント追加**: `src/constants/config.ts`を更新し、対応するフックを作成
- **新ファイルタイプ対応**: `src/utils/fileType.ts`の`getFileType()`を拡張
- **UIコンポーネント**: `src/components/`にTypeScriptプロパティインターフェース付きで配置
- **エラーハンドリング**: `MESSAGES`定数と`ErrorModal`コンポーネントを使用

## バックエンド依存関係
このフロントエンドは特定のレスポンス形式のREST APIを想定（`src/types/api.ts`参照）:
- ファイルリストレスポンス: `{ status: "success", list: DirectoryItem[] }`
- エラーレスポンス: `{ status: "error", message: string }`
- ファイルアップロード: `/api/upload/`へのFormData送信
