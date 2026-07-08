import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MultiFileUploadModal from "@/components/MultiFileUploadModal";
import { getMultiFileUploadCountLabel, MESSAGES } from "@/constants/messages";
import type { FileUploadProgress } from "@/hooks/useMultiFileUpload";

const mockUseMultiFileUpload = vi.fn();

vi.mock("@/hooks/useMultiFileUpload", () => ({
  default: () => mockUseMultiFileUpload(),
}));

const files = [new File(["a"], "a.txt"), new File(["b"], "b.txt")];

const setupHook = (
  overrides: Partial<{
    isUploading: boolean;
    progress: FileUploadProgress[];
  }> = {},
) => {
  const hook = {
    isUploading: false,
    progress: [] as FileUploadProgress[],
    uploadFiles: vi.fn(),
    abort: vi.fn(),
    ...overrides,
  };
  mockUseMultiFileUpload.mockReturnValue(hook);
  return hook;
};

const renderModal = (
  props: Partial<React.ComponentProps<typeof MultiFileUploadModal>> = {},
) => {
  const merged = {
    files,
    currentPath: "docs",
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    onFileListUpdate: vi.fn(),
    showToast: vi.fn(),
    ...props,
  };
  render(<MultiFileUploadModal {...merged} />);
  return merged;
};

describe("MultiFileUploadModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the selected files with a count label", () => {
    setupHook();
    renderModal();

    expect(screen.getByText("a.txt")).toBeInTheDocument();
    expect(screen.getByText("b.txt")).toBeInTheDocument();
    expect(
      screen.getByText(getMultiFileUploadCountLabel(files.length)),
    ).toBeInTheDocument();
  });

  it("starts the upload when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    const hook = setupHook();
    renderModal();

    await user.click(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_FILES_ARIA_LABEL }),
    );

    expect(hook.uploadFiles).toHaveBeenCalledWith(files, "docs");
  });

  it("disables the confirm button while uploading", () => {
    setupHook({
      isUploading: true,
      progress: [
        { fileName: "a.txt", status: "uploading" },
        { fileName: "b.txt", status: "pending" },
      ],
    });
    renderModal();

    expect(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_FILES_ARIA_LABEL }),
    ).toBeDisabled();
  });

  it("notifies success when all files uploaded", () => {
    setupHook({
      progress: [
        { fileName: "a.txt", status: "success" },
        { fileName: "b.txt", status: "success" },
      ],
    });
    const { onSuccess, showToast } = renderModal();

    expect(showToast).toHaveBeenCalledWith(
      "success",
      MESSAGES.MULTI_FILE_UPLOAD_SUCCESS,
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("refreshes the file list but stays open on partial failure", () => {
    setupHook({
      progress: [
        { fileName: "a.txt", status: "success" },
        { fileName: "b.txt", status: "error" },
      ],
    });
    const { onSuccess, onFileListUpdate, showToast } = renderModal();

    expect(showToast).toHaveBeenCalledWith(
      "warning",
      MESSAGES.MULTI_FILE_UPLOAD_PARTIAL_ERROR,
    );
    expect(onFileListUpdate).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("aborts the upload when the modal is closed", async () => {
    const user = userEvent.setup();
    const hook = setupHook();
    const { onClose } = renderModal();

    await user.click(
      screen.getByRole("button", { name: MESSAGES.CLOSE_MODAL }),
    );
    const overlay = screen.getByRole("dialog").parentElement;
    if (overlay) {
      fireEvent.animationEnd(overlay);
    }

    expect(hook.abort).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});
