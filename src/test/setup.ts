import "@testing-library/jest-dom";
import { addCollection } from "@iconify/react";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { ICON_COLLECTIONS } from "@/constants/icons";

// Register bundled icon data so Icon components render synchronously and
// never schedule Iconify API requests that outlive a test's teardown.
for (const collection of ICON_COLLECTIONS) {
  addCollection(collection);
}

afterEach(() => {
  cleanup();
});
