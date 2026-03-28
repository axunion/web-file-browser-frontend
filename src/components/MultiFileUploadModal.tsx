import { Icon } from "@iconify/react";
import { memo, useCallback, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import {
	getMultiFileUploadCountLabel,
	getMultiFileUploadProgressLabel,
	MESSAGES,
} from "@/constants/messages";
import useMultiFileUpload, {
	type FileUploadStatus,
} from "@/hooks/useMultiFileUpload";
import type { ToastType } from "@/hooks/useToast";
import commonStyles from "./ModalCommon.module.css";
import styles from "./MultiFileUploadModal.module.css";

const STATUS_ICON: Record<FileUploadStatus, string> = {
	pending: "line-md:minus-circle",
	uploading: "eos-icons:loading",
	success: "line-md:confirm-circle",
	error: "flat-color-icons:cancel",
};

const STATUS_STYLE: Record<FileUploadStatus, string> = {
	pending: styles.statusPending,
	uploading: styles.statusUploading,
	success: styles.statusSuccess,
	error: styles.statusError,
};

export type MultiFileUploadModalProps = {
	files: File[];
	currentPath: string;
	onClose: () => void;
	onSuccess: () => void;
	showToast: (type: ToastType, message: string) => void;
};

const MultiFileUploadModal = memo(
	({
		files,
		currentPath,
		onClose,
		onSuccess,
		showToast,
	}: MultiFileUploadModalProps) => {
		const { isUploading, progress, uploadFiles, abort } = useMultiFileUpload();

		const handleClose = useCallback(() => {
			abort();
			onClose();
		}, [abort, onClose]);

		const handleUpload = useCallback(async () => {
			await uploadFiles(files, currentPath);
		}, [files, currentPath, uploadFiles]);

		useEffect(() => {
			if (progress.length === 0) return;
			if (isUploading) return;

			const hasError = progress.some((p) => p.status === "error");
			const allSuccess = progress.every((p) => p.status === "success");

			if (allSuccess) {
				showToast("success", MESSAGES.MULTI_FILE_UPLOAD_SUCCESS);
				onSuccess();
			} else if (hasError) {
				showToast("warning", MESSAGES.MULTI_FILE_UPLOAD_PARTIAL_ERROR);
			}
		}, [isUploading, progress, onSuccess, showToast]);

		const completedCount = progress.filter(
			(p) => p.status === "success" || p.status === "error",
		).length;

		const showProgress =
			isUploading || progress.some((p) => p.status !== "pending");

		return (
			<Modal onClose={handleClose}>
				<section>
					<div className={commonStyles.header}>
						<Icon icon="line-md:upload-loop" className={commonStyles.icon} />
						<span className={commonStyles.title}>{MESSAGES.UPLOAD_FILES}</span>
					</div>

					<div className={styles.fileList} aria-busy={isUploading}>
						{(progress.length > 0
							? progress
							: files.map((f) => ({
									fileName: f.name,
									status: "pending" as FileUploadStatus,
								}))
						).map((item) => (
							<div key={item.fileName} className={styles.fileItem}>
								<Icon
									icon={STATUS_ICON[item.status]}
									className={`${styles.statusIcon} ${STATUS_STYLE[item.status]}`}
									aria-hidden
								/>
								<span className={styles.fileName}>{item.fileName}</span>
							</div>
						))}
					</div>

					<p className={styles.progress}>
						{showProgress
							? getMultiFileUploadProgressLabel(completedCount, files.length)
							: getMultiFileUploadCountLabel(files.length)}
					</p>

					<button
						type="button"
						disabled={isUploading}
						aria-label={MESSAGES.UPLOAD_FILES_ARIA_LABEL}
						className={`${commonStyles.submitButton} ${styles.submitButton}`}
						onClick={handleUpload}
					>
						{MESSAGES.CONFIRM}
					</button>

					{isUploading && <LoadingSpinner />}
				</section>
			</Modal>
		);
	},
);

export default MultiFileUploadModal;
