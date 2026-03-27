import { useCallback, useState } from "react";
import FileUploadButton from "@/components/FileUploadButton";
import FileUploadModal from "@/components/FileUploadModal";
import ImageUploadModal from "@/components/ImageUploadModal";
import { MESSAGES } from "@/constants/messages";
import { getParentPaths, setPaths } from "@/utils/path";
import BackButton from "./BackButton";
import styles from "./Header.module.css";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_IMAGE_COUNT = 10;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_TOTAL_SIZE = 30 * 1024 * 1024;

export type HeaderProps = {
	title?: string;
	paths: string[];
	onFileListUpdate: () => void;
};

const Header = ({ title, paths, onFileListUpdate }: HeaderProps) => {
	const currentPath = paths.join("/");
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [validationError, setValidationError] = useState<string | null>(null);

	const onFilesSelected = useCallback((files: File[]): void => {
		if (files.length === 0) {
			return;
		}

		if (files.length > 1) {
			if (!files.every((f) => IMAGE_TYPES.has(f.type))) {
				setValidationError(MESSAGES.IMAGE_UPLOAD_INVALID_TYPE);
				return;
			}
			if (files.length > MAX_IMAGE_COUNT) {
				setValidationError(MESSAGES.IMAGE_UPLOAD_TOO_MANY);
				return;
			}
			if (files.some((f) => f.size > MAX_IMAGE_SIZE)) {
				setValidationError(MESSAGES.IMAGE_UPLOAD_FILE_TOO_LARGE);
				return;
			}
			if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_SIZE) {
				setValidationError(MESSAGES.IMAGE_UPLOAD_TOTAL_TOO_LARGE);
				return;
			}
		}

		setValidationError(null);
		setSelectedFiles(files);
	}, []);

	const onClosed = useCallback(() => {
		setSelectedFiles([]);
	}, []);

	const handleBack = useCallback(() => {
		setPaths(getParentPaths(paths));
	}, [paths]);

	const handleUploadSuccess = useCallback(() => {
		setSelectedFiles([]);
		onFileListUpdate();
	}, [onFileListUpdate]);

	return (
		<>
			<header className={styles.header}>
				<span className={styles.slot}>
					{title && title !== "trash" && <BackButton onBack={handleBack} />}
				</span>

				<h1 className={styles.title}>
					<span>{title ?? MESSAGES.APP_TITLE}</span>
				</h1>

				<span className={styles.slot}>
					{title !== "trash" && (
						<FileUploadButton onFilesSelected={onFilesSelected} />
					)}
				</span>
			</header>

			{validationError && (
				<p role="alert" className={styles.validationError}>
					{validationError}
				</p>
			)}

			{selectedFiles.length === 1 && (
				<FileUploadModal
					file={selectedFiles[0]}
					currentPath={currentPath}
					onClose={onClosed}
					onSuccess={handleUploadSuccess}
				/>
			)}

			{selectedFiles.length > 1 && (
				<ImageUploadModal
					files={selectedFiles}
					currentPath={currentPath}
					onClose={onClosed}
					onSuccess={handleUploadSuccess}
				/>
			)}
		</>
	);
};

export default Header;
