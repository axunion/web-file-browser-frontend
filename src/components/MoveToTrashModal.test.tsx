import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MoveToTrashModal from "@/components/MoveToTrashModal";
import { MESSAGES } from "@/constants/messages";
import useDelete from "@/hooks/useDelete";

vi.mock("@/hooks/useDelete", () => ({ default: vi.fn() }));

const mockedUseDelete = vi.mocked(useDelete);

const hookReturn = (overrides: Partial<ReturnType<typeof useDelete>> = {}) => ({
  isLoading: false,
  error: null,
  deleteFile: vi.fn().mockResolvedValue({
    status: "success" as const,
    path: "docs",
    filename: "old.txt",
  }),
  abort: vi.fn(),
  ...overrides,
});

const renderModal = (
  props: Partial<React.ComponentProps<typeof MoveToTrashModal>> = {},
) => {
  const merged = {
    item: { name: "old.txt", type: "file" as const },
    currentPath: "docs",
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    ...props,
  };
  render(<MoveToTrashModal {...merged} />);
  return merged;
};

describe("MoveToTrashModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseDelete.mockReturnValue(hookReturn());
  });

  it("deletes the item at the current path and calls onSuccess", async () => {
    const user = userEvent.setup();
    const deleteFile = vi.fn().mockResolvedValue({
      status: "success" as const,
      path: "docs",
      filename: "old.txt",
    });
    mockedUseDelete.mockReturnValue(hookReturn({ deleteFile }));
    const { onSuccess } = renderModal();

    await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
    expect(deleteFile).toHaveBeenCalledWith({
      path: "docs",
      name: "old.txt",
    });
  });

  it("keeps the modal open and shows the message on API errors", async () => {
    const user = userEvent.setup();
    mockedUseDelete.mockReturnValue(
      hookReturn({
        deleteFile: vi.fn().mockResolvedValue({
          status: "error",
          message: "削除失敗",
        }),
      }),
    );
    const { onSuccess } = renderModal();

    await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

    expect(await screen.findByText("削除失敗")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("disables the confirm button while deleting", () => {
    mockedUseDelete.mockReturnValue(hookReturn({ isLoading: true }));
    renderModal();

    expect(
      screen.getByRole("button", { name: MESSAGES.CONFIRM }),
    ).toBeDisabled();
  });
});
