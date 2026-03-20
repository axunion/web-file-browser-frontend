import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FileUploadModal from "@/components/FileUploadModal";
import MoveModal from "@/components/MoveModal";
import MoveToTrashModal from "@/components/MoveToTrashModal";
import RenameModal from "@/components/RenameModal";
import { MESSAGES } from "@/constants/messages";
import useDelete from "@/hooks/useDelete";
import useFileList from "@/hooks/useFileList";
import useFileMove from "@/hooks/useFileMove";
import useFileRename from "@/hooks/useFileRename";
import useFileUpload from "@/hooks/useFileUpload";

vi.mock("@/hooks/useFileUpload", () => ({ default: vi.fn() }));
vi.mock("@/hooks/useFileRename", () => ({ default: vi.fn() }));
vi.mock("@/hooks/useFileMove", () => ({ default: vi.fn() }));
vi.mock("@/hooks/useDelete", () => ({ default: vi.fn() }));
vi.mock("@/hooks/useFileList", () => ({ default: vi.fn() }));

const mockedUseFileUpload = vi.mocked(useFileUpload);
const mockedUseFileRename = vi.mocked(useFileRename);
const mockedUseFileMove = vi.mocked(useFileMove);
const mockedUseDelete = vi.mocked(useDelete);
const mockedUseFileList = vi.mocked(useFileList);

describe("file mutation modals", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockedUseFileList.mockReturnValue({
			items: [{ name: "dest", type: "directory" }],
			isLoading: false,
			errorMessage: null,
			setPath: vi.fn(),
			refresh: vi.fn().mockResolvedValue(undefined),
		});
	});

	it("should not treat upload API error payloads as success", async () => {
		const uploadFile = vi.fn().mockResolvedValue({
			status: "error",
			message: "アップロード失敗",
		});
		const onSuccess = vi.fn();

		mockedUseFileUpload.mockReturnValue({
			isLoading: false,
			error: null,
			uploadFile,
			abort: vi.fn(),
		});

		render(
			<FileUploadModal
				file={new File(["file"], "sample.txt")}
				onClose={vi.fn()}
				onSuccess={onSuccess}
			/>,
		);

		fireEvent.click(
			screen.getByRole("button", { name: MESSAGES.UPLOAD_FILE_ARIA_LABEL }),
		);

		await waitFor(() => {
			expect(onSuccess).not.toHaveBeenCalled();
		});

		expect(await screen.findByText("アップロード失敗")).toBeInTheDocument();
	});

	it("should keep the rename modal open when the API returns an error payload", async () => {
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
				currentPath="albums%2F2026"
				onClose={vi.fn()}
				onSuccess={onSuccess}
			/>,
		);

		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "photo-renamed" },
		});
		fireEvent.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

		await waitFor(() => {
			expect(renameFile).toHaveBeenCalledWith({
				path: "albums%2F2026",
				name: "photo.jpg",
				newName: "photo-renamed.jpg",
			});
		});

		expect(onSuccess).not.toHaveBeenCalled();
		expect(await screen.findByText("名前変更失敗")).toBeInTheDocument();
	});

	it("should pass the current path to delete and keep the modal open on API errors", async () => {
		const deleteFile = vi.fn().mockResolvedValue({
			status: "error",
			message: "削除失敗",
		});
		const onSuccess = vi.fn();

		mockedUseDelete.mockReturnValue({
			isLoading: false,
			error: null,
			deleteFile,
			abort: vi.fn(),
		});

		render(
			<MoveToTrashModal
				item={{ name: "old.txt", type: "file" }}
				currentPath="nested%2Ffolder"
				onClose={vi.fn()}
				onSuccess={onSuccess}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

		await waitFor(() => {
			expect(deleteFile).toHaveBeenCalledWith({
				path: "nested%2Ffolder",
				name: "old.txt",
			});
		});

		expect(onSuccess).not.toHaveBeenCalled();
		expect(await screen.findByText("削除失敗")).toBeInTheDocument();
	});

	it("should not treat move API error payloads as success", async () => {
		const moveFile = vi.fn().mockResolvedValue({
			status: "error",
			message: "移動失敗",
		});
		const onSuccess = vi.fn();

		mockedUseFileMove.mockReturnValue({
			isLoading: false,
			error: null,
			moveFile,
			abort: vi.fn(),
		});

		render(
			<MoveModal
				item={{ name: "report.pdf", type: "file" }}
				currentPath="source"
				onClose={vi.fn()}
				onSuccess={onSuccess}
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "dest" }));
		fireEvent.click(screen.getByRole("button", { name: MESSAGES.CONFIRM }));

		await waitFor(() => {
			expect(moveFile).toHaveBeenCalledWith({
				path: "source",
				name: "report.pdf",
				destinationPath: "dest",
			});
		});

		expect(onSuccess).not.toHaveBeenCalled();
		expect(await screen.findByText("移動失敗")).toBeInTheDocument();
	});
});
