import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FileList from "@/components/FileList";
import {
  getFileItemAriaLabel,
  getImageAlt,
  getOpenFileAriaLabel,
  MESSAGES,
} from "@/constants/messages";
import type { DirectoryItem } from "@/types/api";

const items: DirectoryItem[] = [
  { name: "docs", type: "directory" },
  { name: "photo 1.jpg", type: "file" },
  { name: "notes.txt", type: "file" },
];

const renderFileList = (
  props: Partial<React.ComponentProps<typeof FileList>> = {},
) =>
  render(
    <FileList
      list={items}
      currentPath="my folder#1"
      onFileListUpdate={vi.fn()}
      isNavigatingRef={{ current: false }}
      {...props}
    />,
  );

const openContextMenu = async (name: string) => {
  fireEvent.mouseDown(screen.getByRole("button", { name }));
  return screen.findByRole("menu");
};

describe("FileList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = "";
  });

  describe("rendering", () => {
    it("renders a button for each item with its accessible name", () => {
      renderFileList();

      for (const item of items) {
        expect(
          screen.getByRole("button", {
            name: getFileItemAriaLabel(item.name, item.type),
          }),
        ).toBeInTheDocument();
      }
    });

    it("URL-encodes every path segment in media and link URLs", () => {
      renderFileList();

      expect(screen.getByAltText(getImageAlt("photo 1.jpg"))).toHaveAttribute(
        "src",
        "http://localhost/data/my%20folder%231/photo%201.jpg",
      );
      expect(
        screen.getByRole("link", { name: getOpenFileAriaLabel("notes.txt") }),
      ).toHaveAttribute(
        "href",
        "http://localhost/data/my%20folder%231/notes.txt",
      );
    });

    it("builds URLs directly under the data endpoint at the root path", () => {
      renderFileList({ currentPath: "" });

      expect(screen.getByAltText(getImageAlt("photo 1.jpg"))).toHaveAttribute(
        "src",
        "http://localhost/data/photo%201.jpg",
      );
    });
  });

  describe("navigation", () => {
    it("navigates into a directory on click", async () => {
      const user = userEvent.setup();
      renderFileList();

      await user.click(
        screen.getByRole("button", {
          name: getFileItemAriaLabel("docs", "directory"),
        }),
      );

      expect(window.location.hash).toBe("#/docs");
    });

    it("does not navigate while a navigation is already in flight", async () => {
      const user = userEvent.setup();
      renderFileList({ isNavigatingRef: { current: true } });

      await user.click(
        screen.getByRole("button", {
          name: getFileItemAriaLabel("docs", "directory"),
        }),
      );

      expect(window.location.hash).toBe("");
    });
  });

  describe("context menu", () => {
    it("opens the context menu with file actions on long-press", async () => {
      renderFileList();

      const menu = await openContextMenu(
        getFileItemAriaLabel("photo 1.jpg", "file"),
      );

      expect(
        within(menu).getByRole("menuitem", { name: MESSAGES.RENAME }),
      ).toBeInTheDocument();
      expect(
        within(menu).getByRole("menuitem", { name: MESSAGES.MOVE }),
      ).toBeInTheDocument();
      expect(
        within(menu).getByRole("menuitem", { name: MESSAGES.DELETE }),
      ).toBeInTheDocument();
    });

    it("omits the move action for directories", async () => {
      renderFileList();

      const menu = await openContextMenu(
        getFileItemAriaLabel("docs", "directory"),
      );

      expect(
        within(menu).queryByRole("menuitem", { name: MESSAGES.MOVE }),
      ).not.toBeInTheDocument();
    });

    it("does not open the context menu when the press is released early", () => {
      renderFileList();

      const button = screen.getByRole("button", {
        name: getFileItemAriaLabel("photo 1.jpg", "file"),
      });
      fireEvent.mouseDown(button);
      fireEvent.mouseUp(button);

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("opens the rename dialog from the context menu", async () => {
      const user = userEvent.setup();
      renderFileList();

      const menu = await openContextMenu(
        getFileItemAriaLabel("photo 1.jpg", "file"),
      );
      await user.click(
        within(menu).getByRole("menuitem", { name: MESSAGES.RENAME }),
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
