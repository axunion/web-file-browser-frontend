import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MESSAGES } from "@/constants/messages";
import * as pathUtils from "@/utils/path";
import Breadcrumb from "./Breadcrumb";

vi.mock("@/utils/path", () => ({
  setPaths: vi.fn(),
  getPath: vi.fn(() => ({ path: "", paths: [] })),
  setPath: vi.fn(),
  appendPath: vi.fn(),
  resetPath: vi.fn(),
  getParentPaths: vi.fn(),
  toEncodedPath: vi.fn(),
}));

describe("Breadcrumb", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders the root breadcrumb item", () => {
      render(<Breadcrumb paths={[]} />);
      expect(screen.getByText(MESSAGES.BREADCRUMB_ROOT)).toBeInTheDocument();
    });

    it("renders a nav with the correct aria-label", () => {
      render(<Breadcrumb paths={[]} />);
      expect(
        screen.getByRole("navigation", { name: MESSAGES.BREADCRUMB }),
      ).toBeInTheDocument();
    });

    it("renders a button for each path segment", () => {
      render(<Breadcrumb paths={["folder1", "folder2", "folder3"]} />);

      expect(
        screen.getByRole("button", { name: "folder1" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "folder2" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "folder3" }),
      ).toBeInTheDocument();
    });

    it("renders no path segment buttons when paths is empty", () => {
      render(<Breadcrumb paths={[]} />);

      // Only the root button should be present (no segment buttons)
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
    });
  });

  describe("navigation", () => {
    it("calls setPaths with an empty array when the root button is clicked", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb paths={["folder1"]} />);

      const rootButton = screen
        .getByText(MESSAGES.BREADCRUMB_ROOT)
        .closest("button") as HTMLButtonElement;
      await user.click(rootButton);

      expect(pathUtils.setPaths).toHaveBeenCalledWith([]);
    });

    it("calls setPaths with a slice up to the clicked segment", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb paths={["a", "b", "c"]} />);

      await user.click(screen.getByRole("button", { name: "b" }));

      expect(pathUtils.setPaths).toHaveBeenCalledWith(["a", "b"]);
    });

    it("calls setPaths with only the first segment when the first item is clicked", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb paths={["a", "b", "c"]} />);

      await user.click(screen.getByRole("button", { name: "a" }));

      expect(pathUtils.setPaths).toHaveBeenCalledWith(["a"]);
    });

    it("calls setPaths with all segments when the last item is clicked", async () => {
      const user = userEvent.setup();
      render(<Breadcrumb paths={["a", "b", "c"]} />);

      await user.click(screen.getByRole("button", { name: "c" }));

      expect(pathUtils.setPaths).toHaveBeenCalledWith(["a", "b", "c"]);
    });
  });
});
