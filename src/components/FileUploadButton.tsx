import { Icon } from "@iconify/react";
import type { ChangeEvent } from "react";
import { MESSAGES } from "@/constants/messages";
import styles from "./FileUploadButton.module.css";

export type FileUploadButtonProps = {
	onFilesSelected: (files: File[]) => void;
};

const FileUploadButton = ({ onFilesSelected }: FileUploadButtonProps) => {
	const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files ? Array.from(event.target.files) : [];
		onFilesSelected(files);
	};

	return (
		<label className={styles.label}>
			<input
				type="file"
				aria-label={MESSAGES.FILE_UPLOAD_BUTTON_ARIA_LABEL}
				tabIndex={0}
				className={styles.input}
				onChange={onFileChange}
			/>

			<Icon icon="line-md:file-upload" className={styles.icon} />
		</label>
	);
};

export default FileUploadButton;
