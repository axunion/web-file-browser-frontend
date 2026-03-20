import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import { MESSAGES } from "@/constants/messages";
import useFileUpload from "@/hooks/useFileUpload";
import { isErrorResponse } from "@/types/api";
import styles from "./FileUploadModal.module.css";
import commonStyles from "./ModalCommon.module.css";

export type FileUploadProps = {
	file: File;
	onClose: () => void;
	onSuccess: () => void;
};

const FileUploadModal = ({ file, onClose, onSuccess }: FileUploadProps) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { isLoading, uploadFile } = useFileUpload();

	const handleUpload = useCallback(async () => {
		try {
			const response = await uploadFile(file);

			if (isErrorResponse(response)) {
				setErrorMessage(response.message || MESSAGES.FILE_UPLOAD_ERROR);
				return;
			}

			onSuccess();
		} catch (error) {
			setErrorMessage(
				error instanceof Error ? error.message : MESSAGES.FILE_UPLOAD_ERROR,
			);
		}
	}, [file, onSuccess, uploadFile]);

	return (
		<Modal onClose={onClose}>
			<section>
				<div className={commonStyles.header}>
					<Icon icon="line-md:upload-loop" className={commonStyles.icon} />
					<span className={commonStyles.title}>{MESSAGES.UPLOAD}</span>
				</div>

				<p className={styles.fileName}>{file.name}</p>

				{errorMessage && (
					<p className={`${commonStyles.error} ${styles.error}`}>
						{errorMessage}
					</p>
				)}

				<button
					type="button"
					disabled={isLoading}
					aria-label={MESSAGES.UPLOAD_FILE_ARIA_LABEL}
					className={`${commonStyles.submitButton} ${styles.submitButton}`}
					onClick={handleUpload}
				>
					{MESSAGES.CONFIRM}
				</button>

				{isLoading && <LoadingSpinner />}
			</section>
		</Modal>
	);
};

export default FileUploadModal;
