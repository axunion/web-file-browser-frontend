// Shared icon-name scanning logic used by both the icon bundle generator
// (scripts/generateIconBundle.mjs) and its drift-detecting test
// (src/constants/icons.test.ts), so the two stay in sync automatically.

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ICON_NAME_PATTERN =
  /"([a-z0-9]+(?:-[a-z0-9]+)*):([a-z0-9]+(?:-[a-z0-9]+)*)"/g;

const isScannedFile = (srcDir, path) =>
  /\.(ts|tsx)$/.test(path) &&
  !/\.test\.(ts|tsx)$/.test(path) &&
  relative(srcDir, path) !== join("constants", "icons.ts");

export const scanIconReferences = (srcDir) => {
  const icons = new Set();
  for (const entry of readdirSync(srcDir, { recursive: true })) {
    const path = join(srcDir, String(entry));
    if (!isScannedFile(srcDir, path)) continue;
    for (const [, prefix, name] of readFileSync(path, "utf8").matchAll(
      ICON_NAME_PATTERN,
    )) {
      icons.add(`${prefix}:${name}`);
    }
  }
  return [...icons].sort();
};
