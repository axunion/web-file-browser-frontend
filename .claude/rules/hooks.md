---
description: Guidelines for creating and editing custom hooks
globs: src/hooks/**
---

# Hook Rules

## API Hook Pattern

Compose API operation hooks on top of `useApiRequest`.

```ts
import { useApiRequest } from "@/hooks/useApiRequest";

const useXxx = () => {
  const { isLoading, error, execute, abort } = useApiRequest<XxxResponse>();

  const doSomething = async (param: string) => {
    return await execute("/api/xxx/", { method: "POST", body: ... });
  };

  return { isLoading, error, doSomething, abort };
};

export default useXxx;
```

## Return Value Convention

```ts
return {
  isLoading,    // boolean
  error,        // string | null
  [actionName], // primary action function
  abort,        // AbortController abort
};
```

## SWR Usage
- Use SWR directly only in `src/hooks/useFileList.ts`
- All other operations (upload / rename / delete, etc.) must use `useApiRequest`

## Other
- Hook files must be prefixed with `use`
- Default export (hook body)
- Always implement side effect cleanup (`abort`, etc.)
