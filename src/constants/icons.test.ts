import { join } from "node:path";
import { getIconData } from "@iconify/utils";
import { describe, expect, it } from "vitest";
import { scanIconReferences } from "../../scripts/iconScan.mjs";
import { ICON_COLLECTIONS } from "./icons";

// Vitest runs from the project root; import.meta.url is not a file: URL in jsdom.
const srcDir = join(process.cwd(), "src");

describe("ICON_COLLECTIONS", () => {
  it("contains data for every icon name referenced in src", () => {
    const referenced = scanIconReferences(srcDir);
    expect(referenced.length).toBeGreaterThan(0);

    const missing = referenced.filter((icon) => {
      const [prefix, name] = icon.split(":");
      const collection = ICON_COLLECTIONS.find((c) => c.prefix === prefix);
      return !collection || !getIconData(collection, name);
    });

    // If this fails, run `pnpm generate:icons` to rebuild src/constants/icons.ts.
    expect(missing).toEqual([]);
  });
});
