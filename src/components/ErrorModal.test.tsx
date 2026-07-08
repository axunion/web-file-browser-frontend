import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ErrorModal from "@/components/ErrorModal";
import { MESSAGES } from "@/constants/messages";

describe("ErrorModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the error title and message inside a dialog", () => {
    render(<ErrorModal onClose={vi.fn()}>読み込みに失敗しました</ErrorModal>);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(MESSAGES.ERROR)).toBeInTheDocument();
    expect(screen.getByText("読み込みに失敗しました")).toBeInTheDocument();
  });

  it("calls onClose after the close button is clicked and the animation ends", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ErrorModal onClose={onClose}>message</ErrorModal>);

    await user.click(
      screen.getByRole("button", { name: MESSAGES.CLOSE_MODAL }),
    );
    const overlay = screen.getByRole("dialog").parentElement as HTMLElement;
    fireEvent.animationEnd(overlay);

    expect(onClose).toHaveBeenCalledOnce();
  });
});
