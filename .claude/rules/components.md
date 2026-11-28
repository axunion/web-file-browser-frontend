---
description: Guidelines for creating and editing components
globs: src/components/**
---

# Component Rules

## Base Pattern

```tsx
import { MESSAGES } from "@/constants/messages";
import styles from "./Xxx.module.css";

export type XxxProps = {
  foo: string;
  onAction: () => void;
};

const Xxx = ({ foo, onAction }: XxxProps) => {
  return <div className={styles.container}>{foo}</div>;
};

export default Xxx;
```

- Arrow function, default export, props via `export type XxxProps`.
- `React.memo` is **not** the default — apply it only where re-renders are hot
  (list rendering: `FileItem`, `FileList`, `Toast`).

## Styling

- CSS Modules: one `Xxx.module.css` per component, imported as `styles`.
- Modals additionally share `ModalCommon.module.css` (header / icon / actions / error).
- Design tokens live in `:root` of `src/App.css`. Colors, z-index, font-size /
  line-height, radius, and shadow must use tokens (`var(--…)`); add a token there
  rather than hardcoding a new value.
- Spacing (padding / margin / gap / position offsets) uses the `--space-N` scale
  (N × 0.25rem). A raw value is allowed only when it is derived from another element's
  geometry (e.g. clearing a fixed header); leave a comment explaining the derivation.
- Not tokenized: breakpoints (CSS variables don't work in `@media`), animation
  timing, and one-off component dimensions.

## Modals

- Build on the base component `src/components/Modal.tsx`.
- Do not implement custom overlay / backdrop.

## Icons

- Use `lucide-react` exclusively (named imports, e.g. `import { Folder } from "lucide-react"`);
  no other icon libraries. Use the current names, not deprecated aliases (`LoaderCircle`,
  not `Loader2`).
- Size icons with `width` / `height` in the component's CSS Module; color comes from
  `currentColor`.
- Icons are `aria-hidden` by default; label the surrounding button instead of the icon.
- A map that holds icon components (not rendered elements) is typed `LucideIcon`.
- Lucide icons are static; add motion with a global animation class (e.g. `spin` in
  `App.css`).

## User-Facing Text

- Every user-visible string comes from the `MESSAGES` constant
  (`src/constants/messages.ts`) — never hardcode them in JSX.

## State

- Simple state: `useState`.
- Multiple interdependent states: `useReducer` + discriminated union actions.

## Accessibility

- `aria-label` on interactive elements without visible text.
- Keyboard support (`onKeyDown`) wherever click handlers exist on non-button elements.
- Set `role` appropriately.
