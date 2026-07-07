import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MESSAGES } from "@/constants/messages";
import Modal from "./Modal";

const renderModal = (
  onClose = vi.fn(),
  children: React.ReactNode = <button type="button">Content</button>,
) => render(<Modal onClose={onClose}>{children}</Modal>);

/** Fire animationEnd on the overlay div (parent of the dialog panel). */
const fireOverlayAnimationEnd = () => {
  const overlay = screen.getByRole("dialog").parentElement as HTMLElement;
  fireEvent.animationEnd(overlay);
};

describe("Modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders children inside the dialog", () => {
      renderModal(vi.fn(), <button type="button">My Button</button>);
      expect(
        screen.getByRole("button", { name: "My Button" }),
      ).toBeInTheDocument();
    });

    it("renders the close button with the correct aria-label", () => {
      renderModal();
      expect(
        screen.getByRole("button", { name: MESSAGES.CLOSE_MODAL }),
      ).toBeInTheDocument();
    });

    it("renders with role='dialog' and aria-modal='true'", () => {
      renderModal();
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
    });
  });

  describe("closing via the close button", () => {
    it("does not call onClose until the animation ends", () => {
      const onClose = vi.fn();
      renderModal(onClose);

      fireEvent.click(
        screen.getByRole("button", { name: MESSAGES.CLOSE_MODAL }),
      );
      expect(onClose).not.toHaveBeenCalled();

      fireOverlayAnimationEnd();
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe("closing via the Escape key", () => {
    it("calls onClose after Escape and animation end", () => {
      const onClose = vi.fn();
      renderModal(onClose);

      fireEvent.keyDown(document, { key: "Escape" });
      expect(onClose).not.toHaveBeenCalled();

      fireOverlayAnimationEnd();
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe("closing via the overlay", () => {
    it("calls onClose when the overlay is clicked and animation ends", () => {
      const onClose = vi.fn();
      renderModal(onClose);

      const overlay = screen.getByRole("dialog").parentElement as HTMLElement;
      fireEvent.pointerDown(overlay);
      fireEvent.animationEnd(overlay);

      expect(onClose).toHaveBeenCalledOnce();
    });

    it("does not close when clicking inside the dialog panel", () => {
      const onClose = vi.fn();
      renderModal(onClose);

      const dialog = screen.getByRole("dialog");
      fireEvent.pointerDown(dialog);

      fireOverlayAnimationEnd();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("animation end without closing", () => {
    it("does not call onClose if animationEnd fires before a close action", () => {
      const onClose = vi.fn();
      renderModal(onClose);

      fireOverlayAnimationEnd();
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("focus management", () => {
    it("restores focus to the previously focused element on unmount", () => {
      const previousButton = document.createElement("button");
      document.body.appendChild(previousButton);
      previousButton.focus();
      expect(document.activeElement).toBe(previousButton);

      const { unmount } = renderModal();
      unmount();

      expect(document.activeElement).toBe(previousButton);
      document.body.removeChild(previousButton);
    });

    it("cycles Tab focus from the last focusable element to the first", () => {
      renderModal(
        vi.fn(),
        <>
          <button type="button">First</button>
          <button type="button">Second</button>
        </>,
      );

      // Focusable order: First, Second, CloseButton
      const closeButton = screen.getByRole("button", {
        name: MESSAGES.CLOSE_MODAL,
      });
      closeButton.focus();
      expect(document.activeElement).toBe(closeButton);

      fireEvent.keyDown(document, { key: "Tab" });

      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "First" }),
      );
    });

    it("cycles Shift+Tab focus from the first focusable element to the last", () => {
      renderModal(
        vi.fn(),
        <>
          <button type="button">First</button>
          <button type="button">Second</button>
        </>,
      );

      const firstButton = screen.getByRole("button", { name: "First" });
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: MESSAGES.CLOSE_MODAL }),
      );
    });
  });
});
