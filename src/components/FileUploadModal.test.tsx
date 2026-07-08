import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FileUploadModal from "@/components/FileUploadModal";
import { MESSAGES } from "@/constants/messages";
import useFileUpload from "@/hooks/useFileUpload";

vi.mock("@/hooks/useFileUpload", () => ({ default: vi.fn() }));

const mockedUseFileUpload = vi.mocked(useFileUpload);

const hookReturn = (
  overrides: Partial<ReturnType<typeof useFileUpload>> = {},
) => ({
  isLoading: false,
  error: null,
  uploadFile: vi.fn().mockResolvedValue({ status: "success" as const }),
  abort: vi.fn(),
  ...overrides,
});

const renderModal = (
  props: Partial<React.ComponentProps<typeof FileUploadModal>> = {},
) => {
  const merged = {
    file: new File(["file"], "sample.txt"),
    currentPath: "documents",
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    ...props,
  };
  render(<FileUploadModal {...merged} />);
  return merged;
};

describe("FileUploadModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseFileUpload.mockReturnValue(hookReturn());
  });

  it("uploads the file to the current path and calls onSuccess", async () => {
    const user = userEvent.setup();
    const uploadFile = vi
      .fn()
      .mockResolvedValue({ status: "success" as const });
    mockedUseFileUpload.mockReturnValue(hookReturn({ uploadFile }));
    const { file, onSuccess } = renderModal();

    await user.click(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_FILE_ARIA_LABEL }),
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
    expect(uploadFile).toHaveBeenCalledWith(file, "documents");
  });

  it("does not treat API error payloads as success", async () => {
    const user = userEvent.setup();
    mockedUseFileUpload.mockReturnValue(
      hookReturn({
        uploadFile: vi.fn().mockResolvedValue({
          status: "error",
          message: "アップロード失敗",
        }),
      }),
    );
    const { onSuccess } = renderModal();

    await user.click(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_FILE_ARIA_LABEL }),
    );

    expect(await screen.findByText("アップロード失敗")).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("disables the upload button while uploading", () => {
    mockedUseFileUpload.mockReturnValue(hookReturn({ isLoading: true }));
    renderModal();

    expect(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_FILE_ARIA_LABEL }),
    ).toBeDisabled();
  });
});
