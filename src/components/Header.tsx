import FileUpload from "@/components/FileUpload";
import FileUploadButton from "@/components/FileUploadButton";
import Modal from "@/components/Modal";
import { useCallback, useState } from "react";
import BackButton from "./BackButton";

export type HeaderProps = {
	title?: string;
};

const Header = ({ title }: HeaderProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const onFilesSelected = useCallback((files: File[]): void => {
		if (files.length === 0) {
			console.error("No files selected");
			return;
		}

		setSelectedFiles(files);
		setIsModalOpen(true);
	}, []);

	const onClosed = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const onUpload = useCallback(() => {
		setSelectedFiles([]);
		setIsModalOpen(false);
	}, []);

	return (
		<>
			<header className="grid grid-cols-[auto_1fr_auto] items-center p-4 gap-3">
				<span className="w-8 h-8">
					{title && title !== "trash" && <BackButton />}
				</span>

				<h1 className="text-xl tracking-wider text-center line-clamp-1 break-all">
					<span>{title ?? "Web File Browser"}</span>
				</h1>

				<span className="w-8 h-8">
					{title !== "trash" && (
						<FileUploadButton onFilesSelected={onFilesSelected} />
					)}
				</span>
			</header>

			{isModalOpen && (
				<Modal onClose={onClosed}>
					<FileUpload file={selectedFiles[0]} onUpload={onUpload} />
				</Modal>
			)}
		</>
	);
};

export default Header;
