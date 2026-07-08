import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "@/components/Header";
import { TRASH_FOLDER_NAME } from "@/constants/config";
import {
  getImageUploadCountLabel,
  getMultiFileUploadCountLabel,
  MESSAGES,
} from "@/constants/messages";
import useFileUpload from "@/hooks/useFileUpload";
import useImageUpload from "@/hooks/useImageUpload";
import useMultiFileUpload from "@/hooks/useMultiFileUpload";

vi.mock("@/hooks/useFileUpload", () => ({ default: vi.fn() }));
vi.mock("@/hooks/useImageUpload", () => ({ default: vi.fn() }));
vi.mock("@/hooks/useMultiFileUpload", () => ({ default: vi.fn() }));

const mockedUseFileUpload = vi.mocked(useFileUpload);
const mockedUseImageUpload = vi.mocked(useImageUpload);
const mockedUseMultiFileUpload = vi.mocked(useMultiFileUpload);

const makeImage = (name: string, size = 1024) => {
  const file = new File(["x"], name, { type: "image/jpeg" });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

const renderHeader = (
  props: Partial<React.ComponentProps<typeof Header>> = {},
) => {
  const merged = {
    title: "docs" as string | undefined,
    paths: ["docs"],
    onFileListUpdate: vi.fn(),
    showToast: vi.fn(),
    ...props,
  };
  render(<Header {...merged} />);
  return merged;
};

const selectFiles = async (files: File[]) => {
  const user = userEvent.setup();
  const input = screen.getByLabelText(MESSAGES.FILE_UPLOAD_BUTTON_ARIA_LABEL);
  await user.upload(input, files);
};

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseFileUpload.mockReturnValue({
      isLoading: false,
      error: null,
      uploadFile: vi.fn().mockResolvedValue({ status: "success" }),
      abort: vi.fn(),
    });
    mockedUseImageUpload.mockReturnValue({
      isLoading: false,
      error: null,
      uploadImages: vi.fn().mockResolvedValue({ status: "success", files: [] }),
      abort: vi.fn(),
    });
    mockedUseMultiFileUpload.mockReturnValue({
      isUploading: false,
      progress: [],
      uploadFiles: vi.fn().mockResolvedValue(undefined),
      abort: vi.fn(),
    });
  });

  describe("rendering", () => {
    it("shows the app title when no directory title is given", () => {
      renderHeader({ title: undefined, paths: [] });

      expect(screen.getByText(MESSAGES.APP_TITLE)).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: MESSAGES.BACK }),
      ).not.toBeInTheDocument();
    });

    it("shows the back button inside a directory", () => {
      renderHeader();

      expect(
        screen.getByRole("button", { name: MESSAGES.BACK }),
      ).toBeInTheDocument();
    });

    it("hides the back button and upload button inside the trash folder", () => {
      renderHeader({
        title: TRASH_FOLDER_NAME,
        paths: [TRASH_FOLDER_NAME],
      });

      expect(
        screen.queryByRole("button", { name: MESSAGES.BACK }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(MESSAGES.FILE_UPLOAD_BUTTON_ARIA_LABEL),
      ).not.toBeInTheDocument();
    });
  });

  describe("upload routing", () => {
    it("opens the single-file upload modal for one file", async () => {
      renderHeader();

      await selectFiles([new File(["a"], "a.txt")]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: MESSAGES.UPLOAD_FILE_ARIA_LABEL }),
      ).toBeInTheDocument();
    });

    it("opens the image upload modal when all files are images", async () => {
      renderHeader();

      await selectFiles([makeImage("a.jpg"), makeImage("b.jpg")]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(getImageUploadCountLabel(2))).toBeInTheDocument();
    });

    it("opens the multi-file upload modal for mixed file types", async () => {
      renderHeader();

      await selectFiles([makeImage("a.jpg"), new File(["b"], "b.txt")]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByText(getMultiFileUploadCountLabel(2)),
      ).toBeInTheDocument();
    });
  });

  describe("image upload validation", () => {
    it("shows an error toast when more than 10 images are selected", async () => {
      const { showToast } = renderHeader();

      await selectFiles(
        Array.from({ length: 11 }, (_, i) => makeImage(`img-${i}.jpg`)),
      );

      expect(showToast).toHaveBeenCalledWith(
        "error",
        MESSAGES.IMAGE_UPLOAD_TOO_MANY,
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("shows an error toast when a single image exceeds 10MB", async () => {
      const { showToast } = renderHeader();

      await selectFiles([
        makeImage("big.jpg", 11 * 1024 * 1024),
        makeImage("small.jpg"),
      ]);

      expect(showToast).toHaveBeenCalledWith(
        "error",
        MESSAGES.IMAGE_UPLOAD_FILE_TOO_LARGE,
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("shows an error toast when the total image size exceeds 30MB", async () => {
      const { showToast } = renderHeader();

      await selectFiles(
        Array.from({ length: 4 }, (_, i) =>
          makeImage(`img-${i}.jpg`, 9 * 1024 * 1024),
        ),
      );

      expect(showToast).toHaveBeenCalledWith(
        "error",
        MESSAGES.IMAGE_UPLOAD_TOTAL_TOO_LARGE,
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
