---
description: カスタムフック作成・編集のガイドライン
globs: src/hooks/**
---

# フックルール

## API フックのパターン

API 操作フックは `useApiRequest` をベースに合成する。

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

## 戻り値の規約

```ts
return {
  isLoading,    // boolean
  error,        // string | null
  [actionName], // 主要な操作関数
  abort,        // AbortController の abort
};
```

## SWR の使用
- SWR を直接使用するのは `src/hooks/useFileList.ts` のみ
- 一覧取得以外の操作（upload / rename / delete 等）は `useApiRequest` を使用

## その他
- フックファイルは `use` プレフィックスで命名
- default export（フック本体）
- 副作用のクリーンアップ（`abort` 等）を忘れずに実装
