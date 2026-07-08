import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MoveModal from "@/components/MoveModal";
import { MESSAGES } from "@/constants/messages";
import useFileList from "@/hooks/useFileList";
import useFileMove from "@/hooks/useFileMove";

vi.mock("@/hooks/useFileMove", () => ({ default: vi.fn() }));
vi.mock("@/hooks/useFileList", () => ({ default: vi.fn() }));

const mockedUseFileMove = vi.mocked(useFileMove);
const mockedUseFileList = vi.mocked(useFileList);

const hookReturn = (
  overrides: Partial<ReturnType<typeof useFileMove>> = {},
) => ({
  isLoading: false,
  error: null,
  moveFile: vi.fn().mockResolvedValue({
    status: "success" as const,
    path: "archive",
    filename: "report.pdf",
  }),
  abort: vi.fn(),
  ...overrides,
});

const renderModal = (
  props: Partial<React.ComponentProps<typeof MoveModal>> = {},
) => {
  const merged = {
    item: { name: "report.pdf", type: "file" as const },
    currentPath: "source",
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    ...props,
  };
  render(<MoveModal {...merged} />);
  return merged;
};

describe("MoveModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseFileMove.mockReturnValue(hookReturn());
    mockedUseFileList.mockReturnValue({
      items: [{ name: "dest", type: "directory" }],
      isLoading: false,
      errorMessage: null,
      setPath: vi.fn(),
      refresh: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("moves the file to the selected destination and calls onSuccess", async () => {
    const user = userEvent.setup();
    const moveFile = vi.fn().mockResolvedValue({
      status: "success" as const,
      path: "dest",
      filename: "report.pdf",
    });
    mockedUseFileMove.mockReturnValue(hookReturn({ moveFile }));
    const { onSuccess } = renderModal();

    await user.click(screen.getByRole("button", { name: "dest" }));
    await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
    expect(moveFile).toHaveBeenCalledWith({
      path: "source",
      name: "report.pdf",
      destinationPath: "dest",
    });
  });

  it("does not treat API error payloads as success", async () => {
    const user = userEvent.setup();
    mockedUseFileMove.mockReturnValue(
      hookReturn({
        moveFile: vi.fn().mockResolvedValue({
          status: "error",
          message: "移動失敗",
        }),
      }),
    );
    const { onSuccess } = renderModal();

    await user.click(screen.getByRole("button", { name: "dest" }));
    await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

    expect(await screen.findByText("移動失敗")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("disables the confirm button while the destination equals the current path", () => {
    renderModal({ currentPath: "" });

    expect(
      screen.getByRole("button", { name: MESSAGES.CONFIRM }),
    ).toBeDisabled();
  });

  it("disables the confirm button while moving", async () => {
    mockedUseFileMove.mockReturnValue(hookReturn({ isLoading: true }));
    renderModal();

    expect(
      screen.getByRole("button", { name: MESSAGES.CONFIRM }),
    ).toBeDisabled();
  });
});
