import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MESSAGES } from "@/constants/messages";
import ContextMenu from "./ContextMenu";

const renderMenu = (
  props: Partial<React.ComponentProps<typeof ContextMenu>> = {},
) => {
  const merged = {
    position: { x: 100, y: 100 },
    onClose: vi.fn(),
    onRename: vi.fn(),
    onTrash: vi.fn(),
    ...props,
  };
  render(<ContextMenu {...merged} />);
  return merged;
};

describe("ContextMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders rename and delete menu items", () => {
      renderMenu();

      expect(
        screen.getByRole("menuitem", { name: MESSAGES.RENAME }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: MESSAGES.DELETE }),
      ).toBeInTheDocument();
    });

    it("does not render the move button when onMove is not provided", () => {
      renderMenu();

      expect(
        screen.queryByRole("menuitem", { name: MESSAGES.MOVE }),
      ).not.toBeInTheDocument();
    });

    it("renders the move button when onMove is provided", () => {
      renderMenu({ onMove: vi.fn() });

      expect(
        screen.getByRole("menuitem", { name: MESSAGES.MOVE }),
      ).toBeInTheDocument();
    });

    it("has a menu container with the correct aria-label", () => {
      renderMenu();

      expect(
        screen.getByRole("menu", { name: MESSAGES.FILE_ACTIONS }),
      ).toBeInTheDocument();
    });
  });

  describe("callback behavior", () => {
    it("calls onRename when the rename item is clicked", async () => {
      const user = userEvent.setup();
      const { onRename } = renderMenu();

      await user.click(screen.getByRole("menuitem", { name: MESSAGES.RENAME }));

      expect(onRename).toHaveBeenCalledOnce();
    });

    it("calls onTrash when the delete item is clicked", async () => {
      const user = userEvent.setup();
      const { onTrash } = renderMenu();

      await user.click(screen.getByRole("menuitem", { name: MESSAGES.DELETE }));

      expect(onTrash).toHaveBeenCalledOnce();
    });

    it("calls onMove when the move item is clicked", async () => {
      const user = userEvent.setup();
      const { onMove } = renderMenu({ onMove: vi.fn() });

      await user.click(screen.getByRole("menuitem", { name: MESSAGES.MOVE }));

      expect(onMove).toHaveBeenCalledOnce();
    });

    it("calls onClose when the overlay is pointer-downed", async () => {
      const user = userEvent.setup();
      const { onClose } = renderMenu();

      await user.click(screen.getByRole("presentation"));

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not call onClose when clicking inside the menu panel", async () => {
      const user = userEvent.setup();
      const { onClose } = renderMenu();

      await user.click(screen.getByRole("menu"));

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("keyboard support", () => {
    it("focuses the first menu item when opened", () => {
      renderMenu();

      expect(
        screen.getByRole("menuitem", { name: MESSAGES.RENAME }),
      ).toHaveFocus();
    });

    it("closes on Escape", async () => {
      const user = userEvent.setup();
      const { onClose } = renderMenu();

      await user.keyboard("{Escape}");

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("moves focus down and wraps with ArrowDown", async () => {
      const user = userEvent.setup();
      renderMenu({ onMove: vi.fn() });

      await user.keyboard("{ArrowDown}");
      expect(
        screen.getByRole("menuitem", { name: MESSAGES.MOVE }),
      ).toHaveFocus();

      await user.keyboard("{ArrowDown}{ArrowDown}");
      expect(
        screen.getByRole("menuitem", { name: MESSAGES.RENAME }),
      ).toHaveFocus();
    });

    it("moves focus up and wraps with ArrowUp", async () => {
      const user = userEvent.setup();
      renderMenu();

      await user.keyboard("{ArrowUp}");

      expect(
        screen.getByRole("menuitem", { name: MESSAGES.DELETE }),
      ).toHaveFocus();
    });
  });
});
