# Web File Browser Frontend

A web UI for browsing and managing files on a server, built with React, TypeScript, and Vite.

This repository contains the frontend only; it requires a separate backend API server.

## Features

- Browse directories with breadcrumb navigation
- Upload files (multiple files with per-file progress, and images)
- Rename, move, trash, and delete files and directories
- Context menu via right-click or long-press

## Requirements

- Node.js 24
- pnpm

## Getting Started

```bash
pnpm install
```

Create `.env.local` in the project root and point it at your backend:

```env
VITE_ENDPOINT_API=http://localhost:8000/api/
VITE_ENDPOINT_DATA=http://localhost:8000/data/
```

| Variable             | Description                             |
| -------------------- | --------------------------------------- |
| `VITE_ENDPOINT_API`  | Base URL of the backend API             |
| `VITE_ENDPOINT_DATA` | Base URL for serving file contents      |

Then start the dev server:

```bash
pnpm dev
```

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start the dev server                     |
| `pnpm build`         | Type-check and build to `dist/`          |
| `pnpm preview`       | Preview the production build             |
| `pnpm check`         | Lint, format-check, and type-check       |
| `pnpm fix`           | Apply lint and format fixes              |
| `pnpm test`          | Run tests in watch mode                  |
| `pnpm test:run`      | Run tests once                           |
| `pnpm test:coverage` | Run tests with a coverage report         |

## Backend API

The app expects the following endpoints under `VITE_ENDPOINT_API`:

| Method | Path              | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `list/`           | List a directory         |
| POST   | `upload/`         | Upload files             |
| POST   | `upload-images/`  | Upload images            |
| POST   | `rename/`         | Rename a file or folder  |
| POST   | `move/`           | Move a file or folder    |
| POST   | `delete/`         | Delete a file or folder  |

## License

[MIT](LICENSE)
