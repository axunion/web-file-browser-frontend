import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Header from "@/components/Header";
import { TRASH_FOLDER_NAME } from "@/constants/config";
import { getMultiFileUploadCountLabel, MESSAGES } from "@/constants/messages";
import useFileUpload from "@/hooks/useFileUpload";
import useMultiFileUpload from "@/hooks/useMultiFileUpload";

vi.mock("@/hooks/useFileUpload", () => ({ default: vi.fn() }));
vi.mock("@/hooks/useMultiFileUpload", () => ({ default: vi.fn() }));

const mockedUseFileUpload = vi.mocked(useFileUpload);
const mockedUseMultiFileUpload = vi.mocked(useMultiFileUpload);

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
    mockedUseMultiFileUpload.mockReturnValue({
      isUploading: false,
      statuses: [],
      uploadFiles: vi.fn().mockResolvedValue(null),
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

    it("opens the multi-file upload modal for several files, images included", async () => {
      renderHeader();

      await selectFiles([
        new File(["a"], "a.jpg", { type: "image/jpeg" }),
        new File(["b"], "b.jpg", { type: "image/jpeg" }),
      ]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByText(getMultiFileUploadCountLabel(2)),
      ).toBeInTheDocument();
    });
  });
});
