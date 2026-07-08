---
description: Guidelines for API types, endpoint constants, and API hooks
globs: src/hooks/**, src/types/**, src/constants/**
---

# API Integration Rules

How the frontend talks to the backend: types → endpoint constant → hook. All three live
in fixed locations; follow existing entries in each file.

## Types (`src/types/api.ts`)

- All API request/response types are consolidated here.
- Responses are discriminated unions on `status`; the error side reuses the shared
  `ErrorResponse` type:

```ts
export type RenameFileRequest = { path: string; name: string; newName: string };

export type RenameFileSuccessResponse = {
  status: "success";
  path: string;
  filename: string;
};

export type RenameFileErrorResponse = ErrorResponse;

export type RenameFileResponse =
  | RenameFileSuccessResponse
  | RenameFileErrorResponse;
```

- Naming: `[Action]Request` / `[Action]SuccessResponse` / `[Action]Response`.
- Narrow with the existing generic guards `isErrorResponse` / `isSuccessResponse` —
  do not add per-endpoint type guards.

## Endpoint Constants (`src/constants/config.ts`)

```ts
export const ENDPOINT_RENAME = `${ENDPOINT_API}rename/`;
```

`ENDPOINT_API` comes from validated env vars (`VITE_ENDPOINT_API`); never read
`import.meta.env` outside `config.ts`.

## Mutation Hooks (`src/hooks/use[Action].ts`)

Compose `useApiRequest` (default export) — never call `fetch` directly. Requests are sent
as `URLSearchParams` (urlencoded) or `FormData` (file upload), **never JSON**:

```ts
import { useCallback } from "react";
import { ENDPOINT_RENAME } from "@/constants/config";
import type { RenameFileRequest, RenameFileResponse } from "@/types/api";
import useApiRequest from "./useApiRequest";

const useRenameFile = () => {
  const { isLoading, error, execute, abort } = useApiRequest<
    RenameFileRequest,
    RenameFileResponse
  >({ endpoint: ENDPOINT_RENAME });

  const renameFile = useCallback(
    (params: RenameFileRequest) =>
      execute(params, (p) => {
        const formData = new URLSearchParams();
        formData.append("path", p.path ?? "");
        formData.append("name", p.name);
        formData.append("newName", p.newName);
        return formData;
      }),
    [execute],
  );

  return { isLoading, error, renameFile, abort };
};

export default useRenameFile;
```

- Return shape: `{ isLoading, error, [actionName], abort }`.
- Abort-on-unmount and error state are handled inside `useApiRequest` — do not
  reimplement them.
- Fallback error messages come from `MESSAGES` in `src/constants/messages.ts`.
- Known exception: `useMultiFileUpload` runs a sequential per-file `fetch` loop with
  its own abort handling, because `useApiRequest` models a single request. Do not
  copy that pattern for ordinary mutations.

## SWR

SWR is used **only** in `src/hooks/useFileList.ts` (the read path). Every mutation
(upload / rename / move / delete) goes through `useApiRequest`.
