# Web File Browser Frontend

[🇯🇵 日本語](README_JA.md) | 🇺🇸 English

A modern web file browser frontend application built with **React + TypeScript + Vite**.  
Features an intuitive and modern UI for browsing and managing files and directories on a server.

> **⚠️ Note**: This project is frontend-only. A corresponding backend API server is required separately.

## ✨ Key Features

- 📁 Directory and file listing
- 🧭 Breadcrumb navigation for hierarchical browsing
- 📤 File upload functionality
- ✏️ File and directory renaming
- ❌ Error handling with modal dialogs
- ⏳ Loading spinner indicators
- 📋 Tab-based UI

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **SWR** - Data fetching and caching library
- **Tailwind CSS** - Utility-first CSS framework
- **@iconify/react** - Icon library
- **@biomejs/biome** - Fast formatter and linter

## 🚀 Setup

### Installation

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root and configure the following environment variables:

```env
VITE_ENDPOINT_API=http://localhost:8000/api/
VITE_ENDPOINT_DATA=http://localhost:8000/data/
```

| Variable | Description |
|----------|-------------|
| `VITE_ENDPOINT_API` | Backend API base URL |
| `VITE_ENDPOINT_DATA` | File data retrieval base URL |

### 3. Start Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### 4. Production Build

```bash
npm run build
```

Build artifacts will be output to the `dist/` folder.

## 📡 API Specification

API endpoints used by this frontend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/list/` | Retrieve file and directory listings |
| `POST` | `/api/upload/` | Upload files |
| `POST` | `/api/rename/` | Rename files and directories |

For detailed specifications, please refer to the corresponding backend project documentation.
