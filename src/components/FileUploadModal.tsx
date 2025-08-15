import { Icon } from "@iconify/react";
import ErrorModal from "@/components/ErrorModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import useFileUpload from "@/hooks/useFileUpload";

export type FileUploadProps = {
	file: File;
	onClose: () => void;
};

const FileUpload = ({ file, onClose }: FileUploadProps) => {
	const { isLoading, error, uploadFile } = useFileUpload();

	const reload = () => {
		window.location.reload();
	};

	const upload = async () => {
		await uploadFile(file);
		reload();
	};

	return (
		<Modal onClose={onClose}>
			<section>
				<div className="flex gap-2 items-center text-(--primary-color)">
					<Icon icon="line-md:upload-loop" className="w-8 h-8" />
					<span className="text-2xl">Upload</span>
				</div>

				<p className="flex justify-center my-12 break-all">{file.name}</p>

				<button
					type="button"
					disabled={isLoading}
					aria-label="Upload file"
					className="block bg-(--primary-color) rounded-full m-auto py-2 px-12 cursor-pointer text-xl text-(--background-color)"
					onClick={upload}
				>
					OK
				</button>

				{isLoading && <LoadingSpinner />}

				{error && (
					<ErrorModal onClose={reload}>エラーが発生しました。</ErrorModal>
				)}
			</section>
		</Modal>
	);
};

export default FileUpload;
