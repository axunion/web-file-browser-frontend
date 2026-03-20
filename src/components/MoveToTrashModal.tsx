import { Icon } from "@iconify/react";
import { useState } from "react";
import Modal from "@/components/Modal";
import { MESSAGES } from "@/constants/messages";
import useDelete from "@/hooks/useDelete";
import type { DirectoryItem } from "@/types/api";

export type MoveToTrashModalProps = {
	item: DirectoryItem;
	currentPath: string;
	onClose: () => void;
	onSuccess: () => void;
};

const MoveToTrashModal = ({
	item,
	currentPath,
	onClose,
	onSuccess,
}: MoveToTrashModalProps) => {
	const [error, setError] = useState<string | null>(null);
	const { deleteFile, isLoading } = useDelete();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await deleteFile({
				path: currentPath,
				name: item.name,
			});
			onSuccess();
		} catch (error) {
			setError(
				error instanceof Error ? error.message : MESSAGES.FILE_DELETE_ERROR,
			);
		}
	};

	return (
		<Modal onClose={onClose}>
			<section>
				<div className="flex gap-2 items-center text-(--primary-color)">
					<Icon icon="line-md:trash" className="w-8 h-8" />
					<span className="text-2xl">{MESSAGES.DELETE}</span>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="my-8 text-center">
						<p>{MESSAGES.CONFIRM_DELETE}</p>
						{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
					</div>

					<div className="flex justify-center">
						<button
							type="submit"
							disabled={isLoading}
							className="block bg-(--primary-color) rounded-full m-auto py-2 px-12 cursor-pointer text-xl text-(--background-color) disabled:bg-(--text-color)"
						>
							{MESSAGES.CONFIRM}
						</button>
					</div>
				</form>
			</section>
		</Modal>
	);
};

export default MoveToTrashModal;
