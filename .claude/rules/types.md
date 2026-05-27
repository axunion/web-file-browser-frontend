---
description: Guidelines for creating and editing type definitions
globs: src/types/**
---

# Type Rules

## Principles
- No `interface` — use `type` only
- No `any` (use `unknown` and narrow with type guards)
- Export with named exports

## API Response Type Pattern

Define API responses as discriminated unions based on the `status` field.

```ts
export type XxxSuccessResponse = {
  status: "success";
  // ... success data
};

export type XxxErrorResponse = {
  status: "error";
  message: string;
};

export type XxxResponse = XxxSuccessResponse | XxxErrorResponse;
```

## Request Type Naming

```
[Action]Request         → request body          (e.g., UploadRequest)
[Action]SuccessResponse → success response       (e.g., UploadSuccessResponse)
[Action]Response        → union type             (e.g., UploadResponse)
```

## Type Guard Implementation

```ts
export const isSuccess = (res: XxxResponse): res is XxxSuccessResponse =>
  res.status === "success";
```

## Other
- Consolidate API-related types in `src/types/api.ts`
- Component-specific types can be defined and exported within the component file
