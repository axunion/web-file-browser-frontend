import { useCallback, useState } from "react";
import FileUploadButton from "@/components/FileUploadButton";
import FileUploadModal from "@/components/FileUploadModal";
import { MESSAGES } from "@/constants/messages";
import { getParentPaths, setPaths } from "@/utils/path";
import BackButton from "./BackButton";

export type HeaderProps = {
	title?: string;
	paths: string[];
	onFileListUpdate: () => void;
};

const Header = ({ title, paths, onFileListUpdate }: HeaderProps) => {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const onFilesSelected = useCallback((files: File[]): void => {
		if (files.length === 0) {
			return;
		}

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
			<header className="grid grid-cols-[auto_1fr_auto] items-center p-4 gap-3">
				<span className="w-8 h-8">
					{title && title !== "trash" && <BackButton onBack={handleBack} />}
				</span>

				<h1 className="text-xl tracking-wider text-center line-clamp-1 break-all">
					<span>{title ?? MESSAGES.APP_TITLE}</span>
				</h1>

				<span className="w-8 h-8">
					{title !== "trash" && (
						<FileUploadButton onFilesSelected={onFilesSelected} />
					)}
				</span>
			</header>

			{selectedFiles.length > 0 && (
				<FileUploadModal
					file={selectedFiles[0]}
					onClose={onClosed}
					onSuccess={handleUploadSuccess}
				/>
			)}
		</>
	);
};

export default Header;
