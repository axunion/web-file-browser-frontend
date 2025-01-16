import FileUpload from "@/components/FileUpload";
import FileUploadButton from "@/components/FileUploadButton";
import Modal from "@/components/Modal";
import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";

const Header = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [files, setFiles] = useState<File[]>([]);

	const onFilesSelected = useCallback((files: File[]): void => {
		if (files.length === 0) {
			console.error("No files selected");
			return;
		}

		setFiles(files);
		setIsModalOpen(true);
	}, []);

	const onClosed = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const onUpload = useCallback(() => {
		setFiles([]);
		setIsModalOpen(false);
	}, []);

	return (
		<>
			<header className="flex justify-between p-4">
				<h1 className="flex items-center gap-2 text-xl tracking-wider">
					<Icon icon="flat-color-icons:folder" className="w-8 h-8" />
					<span>Web File Browser</span>
				</h1>

				<FileUploadButton onFilesSelected={onFilesSelected} />
			</header>

			{isModalOpen && (
				<Modal onClose={onClosed}>
					<FileUpload file={files[0]} onUpload={onUpload} />
				</Modal>
			)}
		</>
	);
};

export default Header;
