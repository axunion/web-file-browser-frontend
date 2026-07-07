import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MESSAGES } from "@/constants/messages";
import type { ToastItem } from "@/hooks/useToast";
import Toast from "./Toast";

const TOAST_DURATION_MS = 4000;

const makeToast = (overrides: Partial<ToastItem> = {}): ToastItem => ({
  id: "toast-1",
  type: "success",
  message: "Operation complete",
  ...overrides,
});

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("renders nothing when the toasts array is empty", () => {
      const { container } = render(<Toast toasts={[]} onDismiss={vi.fn()} />);
      expect(container).toBeEmptyDOMElement();
    });

    it("renders each toast message", () => {
      const toasts = [
        makeToast({ id: "1", message: "First message" }),
        makeToast({ id: "2", message: "Second message" }),
      ];
      render(<Toast toasts={toasts} onDismiss={vi.fn()} />);

      expect(screen.getByText("First message")).toBeInTheDocument();
      expect(screen.getByText("Second message")).toBeInTheDocument();
    });

    it("renders a dismiss button for each toast", () => {
      render(
        <Toast
          toasts={[makeToast({ id: "a" }), makeToast({ id: "b" })]}
          onDismiss={vi.fn()}
        />,
      );

      expect(
        screen.getAllByRole("button", { name: MESSAGES.DISMISS_TOAST }),
      ).toHaveLength(2);
    });

    it("renders each toast as an alert region", () => {
      render(
        <Toast
          toasts={[makeToast({ id: "a" }), makeToast({ id: "b" })]}
          onDismiss={vi.fn()}
        />,
      );

      expect(screen.getAllByRole("alert")).toHaveLength(2);
    });
  });

  describe("dismissing via the button", () => {
    it("calls onDismiss with the toast id after clicking dismiss and animation ends", () => {
      const onDismiss = vi.fn();
      render(
        <Toast toasts={[makeToast({ id: "abc" })]} onDismiss={onDismiss} />,
      );

      fireEvent.click(
        screen.getByRole("button", { name: MESSAGES.DISMISS_TOAST }),
      );

      // animationEnd on the alert div triggers onDismiss
      fireEvent.animationEnd(screen.getByRole("alert"));

      expect(onDismiss).toHaveBeenCalledWith("abc");
    });

    it("does not call onDismiss before the animation ends", () => {
      const onDismiss = vi.fn();
      render(
        <Toast toasts={[makeToast({ id: "abc" })]} onDismiss={onDismiss} />,
      );

      fireEvent.click(
        screen.getByRole("button", { name: MESSAGES.DISMISS_TOAST }),
      );

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe("auto-dismiss timer", () => {
    it("calls onDismiss after TOAST_DURATION_MS when the timer fires", () => {
      const onDismiss = vi.fn();
      render(
        <Toast
          toasts={[makeToast({ id: "timer-test" })]}
          onDismiss={onDismiss}
        />,
      );

      act(() => {
        vi.advanceTimersByTime(TOAST_DURATION_MS);
      });

      fireEvent.animationEnd(screen.getByRole("alert"));

      expect(onDismiss).toHaveBeenCalledWith("timer-test");
    });

    it("does not call onDismiss before the timer fires", () => {
      const onDismiss = vi.fn();
      render(
        <Toast
          toasts={[makeToast({ id: "timer-test" })]}
          onDismiss={onDismiss}
        />,
      );

      act(() => {
        vi.advanceTimersByTime(TOAST_DURATION_MS - 1);
      });

      fireEvent.animationEnd(screen.getByRole("alert"));

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });
});
