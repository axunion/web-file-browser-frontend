import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MultiFileUploadModal from "@/components/MultiFileUploadModal";
import {
  getMultiFileUploadCountLabel,
  getMultiFileUploadProgressLabel,
  MESSAGES,
} from "@/constants/messages";
import type { FileUploadStatus } from "@/hooks/useMultiFileUpload";

const mockUseMultiFileUpload = vi.fn();

vi.mock("@/hooks/useMultiFileUpload", () => ({
  default: () => mockUseMultiFileUpload(),
}));

const files = [new File(["a"], "a.txt"), new File(["b"], "b.txt")];

const setupHook = (
  overrides: Partial<{
    isUploading: boolean;
    statuses: FileUploadStatus[];
    uploadFiles: ReturnType<typeof vi.fn>;
  }> = {},
) => {
  const hook = {
    isUploading: false,
    statuses: [] as FileUploadStatus[],
    uploadFiles: vi.fn().mockResolvedValue(null),
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
    setupHook({ isUploading: true, statuses: ["uploading", "pending"] });
    renderModal();

    expect(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_FILES_ARIA_LABEL }),
    ).toBeDisabled();
    expect(
      screen.getByText(getMultiFileUploadProgressLabel(0, files.length)),
    ).toBeInTheDocument();
  });

  it("notifies success when all files uploaded", async () => {
    const user = userEvent.setup();
    setupHook({
      uploadFiles: vi.fn().mockResolvedValue(["success", "success"]),
    });
    const { onSuccess, onFileListUpdate, showToast } = renderModal();

    await user.click(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_FILES_ARIA_LABEL }),
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
    expect(showToast).toHaveBeenCalledWith(
      "success",
      MESSAGES.MULTI_FILE_UPLOAD_SUCCESS,
    );
    expect(onFileListUpdate).not.toHaveBeenCalled();
  });

  it("refreshes the file list but stays open on partial failure", async () => {
    const user = userEvent.setup();
    setupHook({
      uploadFiles: vi.fn().mockResolvedValue(["success", "error"]),
    });
    const { onSuccess, onFileListUpdate, showToast } = renderModal();

    await user.click(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_FILES_ARIA_LABEL }),
    );

    await waitFor(() => {
      expect(onFileListUpdate).toHaveBeenCalledTimes(1);
    });
    expect(showToast).toHaveBeenCalledWith(
      "warning",
      MESSAGES.MULTI_FILE_UPLOAD_PARTIAL_ERROR,
    );
    expect(onSuccess).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("stays silent when the upload was aborted", async () => {
    const user = userEvent.setup();
    const hook = setupHook({ uploadFiles: vi.fn().mockResolvedValue(null) });
    const { onSuccess, onFileListUpdate, showToast } = renderModal();

    await user.click(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_FILES_ARIA_LABEL }),
    );

    await waitFor(() => {
      expect(hook.uploadFiles).toHaveBeenCalledOnce();
    });
    expect(showToast).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onFileListUpdate).not.toHaveBeenCalled();
  });
});
