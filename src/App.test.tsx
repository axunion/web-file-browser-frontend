import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import { getFileItemAriaLabel, MESSAGES } from "@/constants/messages";
import useFileList from "@/hooks/useFileList";

vi.mock("@/hooks/useFileList", () => ({ default: vi.fn() }));

const mockedUseFileList = vi.mocked(useFileList);

describe("App navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = "#/first/second";

    mockedUseFileList.mockReturnValue({
      items: [],
      isLoading: false,
      errorMessage: null,
      refresh: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("should navigate to the parent directory from the header back button", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: MESSAGES.BACK }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#/first");
    });
  });
});

describe("App error modal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = "";
  });

  it("shows the error again when the retry fails with the same message", async () => {
    const user = userEvent.setup();
    let resolveRetry: () => void = () => {};
    const refresh = vi.fn(
      () =>
        new Promise<undefined>((resolve) => {
          resolveRetry = () => resolve(undefined);
        }),
    );
    mockedUseFileList.mockReturnValue({
      items: [],
      isLoading: false,
      errorMessage: "Server down",
      refresh,
    });
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: MESSAGES.CLOSE_MODAL }),
    );
    // Modal calls onClose once its closing animation ends.
    fireEvent.animationEnd(
      screen.getByRole("dialog").parentElement as HTMLElement,
    );

    expect(refresh).toHaveBeenCalledOnce();
    expect(screen.queryByText("Server down")).not.toBeInTheDocument();

    await act(async () => {
      resolveRetry();
    });

    expect(screen.getByText("Server down")).toBeInTheDocument();
  });
});

describe("App file actions across navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = "#/docs";

    mockedUseFileList.mockReturnValue({
      items: [{ name: "a.txt", type: "file" }],
      isLoading: false,
      errorMessage: null,
      refresh: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("closes an open dialog when the folder changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    screen
      .getByRole("button", { name: getFileItemAriaLabel("a.txt", "file") })
      .focus();
    await user.keyboard("{Shift>}{F10}{/Shift}");
    await user.click(
      within(screen.getByRole("menu")).getByRole("menuitem", {
        name: MESSAGES.DELETE,
      }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await act(async () => {
      window.location.hash = "";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
