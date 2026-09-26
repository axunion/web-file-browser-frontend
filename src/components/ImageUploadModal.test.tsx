import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ImageUploadModal from "@/components/ImageUploadModal";
import { MESSAGES } from "@/constants/messages";
import useImageUpload from "@/hooks/useImageUpload";

vi.mock("@/hooks/useImageUpload", () => ({ default: vi.fn() }));

const mockedUseImageUpload = vi.mocked(useImageUpload);

const hookReturn = (
  overrides: Partial<ReturnType<typeof useImageUpload>> = {},
) => ({
  isLoading: false,
  error: null,
  uploadImages: vi
    .fn()
    .mockResolvedValue({ status: "success" as const, files: [] }),
  abort: vi.fn(),
  ...overrides,
});

const renderModal = (
  props: Partial<React.ComponentProps<typeof ImageUploadModal>> = {},
) => {
  const merged = {
    files: [new File(["a"], "a.jpg", { type: "image/jpeg" })],
    currentPath: "photos",
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    ...props,
  };
  render(<ImageUploadModal {...merged} />);
  return merged;
};

describe("ImageUploadModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseImageUpload.mockReturnValue(hookReturn());
  });

  it("uploads the images to the current path and calls onSuccess", async () => {
    const user = userEvent.setup();
    const uploadImages = vi
      .fn()
      .mockResolvedValue({ status: "success" as const, files: [] });
    mockedUseImageUpload.mockReturnValue(hookReturn({ uploadImages }));
    const { files, onSuccess } = renderModal();

    await user.click(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_IMAGES_ARIA_LABEL }),
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce();
    });
    expect(uploadImages).toHaveBeenCalledWith(files, "photos");
  });

  it("does not call onSuccess when the upload fails", async () => {
    const user = userEvent.setup();
    const uploadImages = vi
      .fn()
      .mockRejectedValue(new Error("画像アップロード失敗"));
    mockedUseImageUpload.mockReturnValue(hookReturn({ uploadImages }));
    const { onSuccess } = renderModal();

    await user.click(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_IMAGES_ARIA_LABEL }),
    );

    await waitFor(() => {
      expect(uploadImages).toHaveBeenCalledOnce();
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("shows the error reported by the upload hook", () => {
    mockedUseImageUpload.mockReturnValue(
      hookReturn({ error: "画像アップロード失敗" }),
    );
    renderModal();

    expect(screen.getByText("画像アップロード失敗")).toBeInTheDocument();
  });

  it("disables the upload button while uploading", () => {
    mockedUseImageUpload.mockReturnValue(hookReturn({ isLoading: true }));
    renderModal();

    expect(
      screen.getByRole("button", { name: MESSAGES.UPLOAD_IMAGES_ARIA_LABEL }),
    ).toBeDisabled();
  });
});
