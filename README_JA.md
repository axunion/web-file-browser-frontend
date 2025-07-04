# Web File Browser Frontend

🇯🇵 日本語 | [🇺🇸 English](README.md)

このプロジェクトは、**React + TypeScript + Vite** を使用したWebファイルブラウザのフロントエンドアプリケーションです。  
直感的でモダンなUIで、サーバー上のファイルやディレクトリの閲覧・操作を行うことができます。

> **⚠️ 注意**: このプロジェクトはフロントエンドのみです。別途、対応するバックエンドAPIサーバーが必要です。

## ✨ 主な機能

- 📁 ディレクトリ・ファイルの一覧表示
- 🧭 パンくずリストによる階層ナビゲーション
- 📤 ファイルのアップロード
- ✏️ ファイル・ディレクトリのリネーム
- ❌ エラーハンドリング（モーダル表示）
- ⏳ ローディングスピナー表示
- 📋 タブ切り替えUI

## 🛠️ 技術スタック

- **React 19** - UI構築
- **TypeScript** - 型安全な開発
- **Vite** - 高速なビルドツール・開発サーバー
- **SWR** - データフェッチ・キャッシュライブラリ
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク
- **@iconify/react** - アイコンライブラリ
- **@biomejs/biome** - 高速なフォーマッター・リンター

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、以下の環境変数を設定してください：

```env
VITE_ENDPOINT_API=http://localhost:8000/api/
VITE_ENDPOINT_DATA=http://localhost:8000/data/
```

| 変数名 | 説明 |
|--------|------|
| `VITE_ENDPOINT_API` | バックエンドAPIのベースURL |
| `VITE_ENDPOINT_DATA` | ファイルデータ取得用のベースURL |

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

### 4. プロダクションビルド

```bash
npm run build
```

ビルド成果物は `dist/` フォルダに出力されます。

## 📡 API仕様

このフロントエンドが使用するAPIエンドポイント：

| メソッド | エンドポイント | 説明 |
|----------|----------------|------|
| `GET` | `/api/list/` | ファイル・ディレクトリ一覧取得 |
| `POST` | `/api/upload/` | ファイルアップロード |
| `POST` | `/api/rename/` | ファイル・ディレクトリのリネーム |

詳細な仕様については、対応するバックエンドプロジェクトのドキュメントを参照してください。

## 🔧 開発用コマンド

```bash
# コードフォーマット（確認のみ）
npm run format

# コードフォーマット（自動修正）
npm run format:write

# リント（確認のみ）
npm run lint

# リント（自動修正）
npm run lint:write

# フォーマット・リント（自動修正）
npm run check:write
```

## 📁 ディレクトリ構成

```
src/
├── components/      # UIコンポーネント
├── hooks/          # カスタムフック
├── constants/      # 定数・設定値
├── types/          # TypeScript型定義
├── utils/          # ユーティリティ関数
└── assets/         # 静的アセット

public/             # 公開静的ファイル
```

## 📄 ライセンス

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。
