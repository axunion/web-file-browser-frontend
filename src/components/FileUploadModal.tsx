import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import { MESSAGES } from "@/constants/messages";
import useFileUpload from "@/hooks/useFileUpload";

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
			await uploadFile(file);
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
				<div className="flex gap-2 items-center text-(--primary-color)">
					<Icon icon="line-md:upload-loop" className="w-8 h-8" />
					<span className="text-2xl">{MESSAGES.UPLOAD}</span>
				</div>

				<p className="flex justify-center my-12 break-all">{file.name}</p>

				{errorMessage && (
					<p className="mb-4 text-sm text-red-600">{errorMessage}</p>
				)}

				<button
					type="button"
					disabled={isLoading}
					aria-label={MESSAGES.UPLOAD_FILE_ARIA_LABEL}
					className="block bg-(--primary-color) rounded-full m-auto py-2 px-12 cursor-pointer text-xl text-(--background-color) disabled:bg-(--text-color)"
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
