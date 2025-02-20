import { Icon } from "@iconify/react";
import type { ChangeEvent } from "react";

export type FileUploadButtonProps = {
	onFilesSelected: (files: File[]) => void;
};

const FileUploadButton = ({ onFilesSelected }: FileUploadButtonProps) => {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files ? Array.from(event.target.files) : [];
		onFilesSelected(files);
	};

	return (
		<label className="cursor-pointer text-(--primary-color)">
			<input
				type="file"
				aria-label="Click to upload files"
				role="button"
				tabIndex={0}
				className="hidden"
				onChange={handleFileChange}
			/>

			<Icon icon="line-md:cloud-alt-upload-filled-loop" className="w-8 h-8" />
		</label>
	);
};

export default FileUploadButton;
