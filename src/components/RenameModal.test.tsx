import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MESSAGES } from "@/constants/messages";
import useFileRename from "@/hooks/useFileRename";
import RenameModal from "./RenameModal";

vi.mock("@/hooks/useFileRename", () => ({ default: vi.fn() }));

const mockedUseFileRename = vi.mocked(useFileRename);

const makeSuccessReturn = (renameFile = vi.fn()) => ({
  isLoading: false,
  error: null,
  renameFile: renameFile.mockResolvedValue({
    status: "success",
    path: "albums",
    filename: "photo-renamed.jpg",
  }),
  abort: vi.fn(),
});

describe("RenameModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseFileRename.mockReturnValue(makeSuccessReturn());
  });

  describe("extension preservation", () => {
    it("shows the name without extension in the input", () => {
      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      expect(screen.getByRole("textbox")).toHaveValue("photo");
    });

    it("appends the original extension to the new name on submit", async () => {
      const renameFile = vi.fn().mockResolvedValue({
        status: "success",
        path: "albums",
        filename: "photo-renamed.jpg",
      });
      mockedUseFileRename.mockReturnValue({
        isLoading: false,
        error: null,
        renameFile,
        abort: vi.fn(),
      });

      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      const user = userEvent.setup();
      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "photo-renamed");
      await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

      await waitFor(() => {
        expect(renameFile).toHaveBeenCalledWith({
          path: "albums",
          name: "photo.jpg",
          newName: "photo-renamed.jpg",
        });
      });
    });

    it("does not add an extension when renaming a directory", async () => {
      const renameFile = vi.fn().mockResolvedValue({
        status: "success",
        path: "",
        filename: "new-folder",
      });
      mockedUseFileRename.mockReturnValue({
        isLoading: false,
        error: null,
        renameFile,
        abort: vi.fn(),
      });

      render(
        <RenameModal
          item={{ name: "my-folder", type: "directory" }}
          currentPath="docs"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      const user = userEvent.setup();
      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "new-folder");
      await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

      await waitFor(() => {
        expect(renameFile).toHaveBeenCalledWith({
          path: "docs",
          name: "my-folder",
          newName: "new-folder",
        });
      });
    });
  });

  describe("validation — reserved names", () => {
    it("shows INVALID_NAME error for '.' and does not call API", async () => {
      const renameFile = vi.fn();
      mockedUseFileRename.mockReturnValue({
        isLoading: false,
        error: null,
        renameFile,
        abort: vi.fn(),
      });

      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      const user = userEvent.setup();
      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, ".");
      await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

      await waitFor(() => {
        expect(screen.getByText(MESSAGES.INVALID_NAME)).toBeInTheDocument();
      });
      expect(renameFile).not.toHaveBeenCalled();
    });

    it("shows INVALID_NAME error for '..' and does not call API", async () => {
      const renameFile = vi.fn();
      mockedUseFileRename.mockReturnValue({
        isLoading: false,
        error: null,
        renameFile,
        abort: vi.fn(),
      });

      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      const user = userEvent.setup();
      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "..");
      await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

      await waitFor(() => {
        expect(screen.getByText(MESSAGES.INVALID_NAME)).toBeInTheDocument();
      });
      expect(renameFile).not.toHaveBeenCalled();
    });
  });

  describe("validation — invalid characters", () => {
    it.each([
      "<",
      ">",
      ":",
      '"',
      "/",
      "\\",
      "|",
      "?",
      "*",
    ])("shows INVALID_NAME_CHARACTERS error for '%s' and does not call API", async (char) => {
      const renameFile = vi.fn();
      mockedUseFileRename.mockReturnValue({
        isLoading: false,
        error: null,
        renameFile,
        abort: vi.fn(),
      });

      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      const user = userEvent.setup();
      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, `file${char}name`);
      await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

      await waitFor(() => {
        expect(
          screen.getByText(MESSAGES.INVALID_NAME_CHARACTERS),
        ).toBeInTheDocument();
      });
      expect(renameFile).not.toHaveBeenCalled();
    });

    it("shows INVALID_NAME_CHARACTERS error for control characters", async () => {
      const renameFile = vi.fn();
      mockedUseFileRename.mockReturnValue({
        isLoading: false,
        error: null,
        renameFile,
        abort: vi.fn(),
      });

      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      // charCode 0 is a control character (< 32)
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "file\x00name" },
      });
      fireEvent.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

      await waitFor(() => {
        expect(
          screen.getByText(MESSAGES.INVALID_NAME_CHARACTERS),
        ).toBeInTheDocument();
      });
      expect(renameFile).not.toHaveBeenCalled();
    });

    it("clears the validation error when the user starts typing again", async () => {
      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      const user = userEvent.setup();
      const input = screen.getByRole("textbox");

      await user.clear(input);
      await user.type(input, ".");
      await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

      await waitFor(() => {
        expect(screen.getByText(MESSAGES.INVALID_NAME)).toBeInTheDocument();
      });

      await user.clear(input);
      await user.type(input, "valid-name");
      expect(screen.queryByText(MESSAGES.INVALID_NAME)).not.toBeInTheDocument();
    });
  });

  describe("no-change behavior", () => {
    it("disables the confirm button when the name is unchanged", () => {
      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />,
      );

      // Input starts with "photo" (without extension) — same as original base name
      expect(
        screen.getByRole("button", { name: MESSAGES.CONFIRM }),
      ).toBeDisabled();
    });
  });

  describe("error path", () => {
    it("keeps the modal open and shows the message on API errors", async () => {
      const renameFile = vi.fn().mockResolvedValue({
        status: "error",
        message: "名前変更失敗",
      });
      const onSuccess = vi.fn();
      mockedUseFileRename.mockReturnValue({
        isLoading: false,
        error: null,
        renameFile,
        abort: vi.fn(),
      });

      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={onSuccess}
        />,
      );

      const user = userEvent.setup();
      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "photo-renamed");
      await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

      expect(await screen.findByText("名前変更失敗")).toBeInTheDocument();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("success path", () => {
    it("calls onSuccess after a successful rename", async () => {
      const renameFile = vi.fn().mockResolvedValue({
        status: "success",
        path: "albums",
        filename: "photo-renamed.jpg",
      });
      const onSuccess = vi.fn();
      mockedUseFileRename.mockReturnValue({
        isLoading: false,
        error: null,
        renameFile,
        abort: vi.fn(),
      });

      render(
        <RenameModal
          item={{ name: "photo.jpg", type: "file" }}
          currentPath="albums"
          onClose={vi.fn()}
          onSuccess={onSuccess}
        />,
      );

      const user = userEvent.setup();
      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "photo-renamed");
      await user.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledOnce();
      });
    });
  });
});
