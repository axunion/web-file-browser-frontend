# Web File Browser Frontend

A modern web file browser frontend built with **React + TypeScript + Vite**.  
Provides an intuitive UI for browsing and managing files and directories on a server.

> **⚠️ Note**: This project is frontend-only. A separate backend API server is required.

## ✨ Features

- 📁 Directory and file listing with breadcrumb navigation
- 📤 File upload — single file, multi-file with per-file progress, and image upload
- ✏️ File and directory renaming
- 🗑️ Move to trash and permanent deletion
- 📂 Move files and directories
- 🖱️ Context menu with right-click / long-press support
- 🔔 Toast notifications for operation feedback
- ❌ Error handling with modal dialogs
- ⏳ Loading indicators

## 🛠️ Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type-safe development |
| Vite | 7 | Build tool and dev server |
| SWR | 2 | Data fetching and caching |
| Lightning CSS | 1 | CSS transformer and minifier |
| CSS Modules | — | Component-scoped styling |
| @iconify/react | 6 | Icon library |
| @biomejs/biome | 2 | Formatter and linter |
| Vitest | 3 | Unit testing framework |
| @testing-library/react | 16 | Component testing utilities |

## 🚀 Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_ENDPOINT_API=http://localhost:8000/api/
VITE_ENDPOINT_DATA=http://localhost:8000/data/
```

| Variable | Description |
|----------|-------------|
| `VITE_ENDPOINT_API` | Backend API base URL |
| `VITE_ENDPOINT_DATA` | File data retrieval base URL |

### 3. Start the development server

```bash
pnpm dev
```

Open `http://localhost:5173` in your browser.

### 4. Build for production

```bash
pnpm build
```

Output is written to the `dist/` directory.

## 🧪 Testing

```bash
pnpm test:run       # Run tests once
pnpm test:coverage  # Run with coverage report
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/list/` | Retrieve file and directory listing |
| `POST` | `/api/upload/` | Upload files |
| `POST` | `/api/upload-images/` | Upload image files |
| `POST` | `/api/rename/` | Rename a file or directory |
| `POST` | `/api/move/` | Move a file or directory |
| `POST` | `/api/delete/` | Delete a file or directory |

For detailed specifications, refer to the backend project documentation.
