import ErrorModal from "@/components/ErrorModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFileUpload from "@/hooks/useFileUpload";
import { Icon } from "@iconify/react";
import { useCallback } from "react";

export type FileUploadProps = {
	file: File;
	onUpload: () => void;
};

const FileUpload = ({ file, onUpload }: FileUploadProps) => {
	const { isLoading, error, uploadFile } = useFileUpload();

	const upload = useCallback(async () => {
		await uploadFile(file);
		onUpload();
	}, [uploadFile, file, onUpload]);

	const reload = () => {
		window.location.reload();
	};

	return (
		<section>
			<div className="flex gap-2 items-center">
				<Icon icon="flat-color-icons:upload" className="w-6 h-6" />
				<span className="text-xl">Upload</span>
			</div>

			<p className="my-8 text-sm">{file.name}</p>

			<button
				type="button"
				disabled={isLoading}
				aria-label="Upload file"
				className="bg-[--primary-color] rounded w-full py-2 text-center text-xl text-[--background-color]"
				onClick={upload}
			>
				OK
			</button>

			{isLoading && <LoadingSpinner />}

			{error && (
				<ErrorModal onClose={reload}>エラーが発生しました。</ErrorModal>
			)}
		</section>
	);
};

export default FileUpload;
