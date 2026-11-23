import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { scanIconReferences } from "../../scripts/iconScan.mjs";
import { ICON_COLLECTIONS } from "./icons";

// Vitest runs from the project root; Vite rewrites `new URL(..., import.meta.url)`
// to a dev-server URL, so it can't locate src on disk.
const srcDir = join(process.cwd(), "src");

describe("ICON_COLLECTIONS", () => {
  it("contains data for every icon name referenced in src", () => {
    const referenced = scanIconReferences(srcDir);
    expect(referenced.length).toBeGreaterThan(0);

    const missing = referenced.filter((icon) => {
      const [prefix, name] = icon.split(":");
      const collection = ICON_COLLECTIONS.find((c) => c.prefix === prefix);
      return !collection?.icons[name] && !collection?.aliases?.[name];
    });

    // If this fails, run `pnpm generate:icons` to rebuild src/constants/icons.ts.
    expect(missing).toEqual([]);
  });
});
