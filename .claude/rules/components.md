---
description: Guidelines for creating and editing components
globs: src/components/**
---

# Component Rules

## Base Pattern

```tsx
import { memo } from "react";

export type XxxProps = {
  foo: string;
  bar?: number;
};

const Xxx = memo(({ foo, bar }: XxxProps) => {
  return <div>{foo}</div>;
});

export default Xxx;
```

- Use arrow function + `React.memo`
- Define props with `export type` — no `interface`
- Export as default export

## Modals
- Use the base component at `src/components/Modal.tsx`
- Do not implement custom overlay / backdrop

## State Management
- Complex UI state (multiple interdependent states): use `useReducer` + discriminated union
- Simple state: `useState` is sufficient

## Icons
- Use the `Icon` component from `@iconify/react` exclusively
- Do not add other icon libraries

## Accessibility
- Add `aria-label` to all interactive elements
- Always implement keyboard handlers (`onKeyDown`)
- Set `role` attributes appropriately
