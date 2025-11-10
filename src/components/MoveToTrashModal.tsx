import { Icon } from "@iconify/react";
import { useState } from "react";
import Modal from "@/components/Modal";
import useFileRename from "@/hooks/useFileRename";
import type { DirectoryItem } from "@/types/api";
import { getPath } from "@/utils/path";

export type MoveToTrashModalProps = {
	item: DirectoryItem;
	onClose: () => void;
	onSuccess: () => void;
};

const MoveToTrashModal = ({
	item,
	onClose,
	onSuccess,
}: MoveToTrashModalProps) => {
	const [error, setError] = useState<string | null>(null);
	const { renameFile, isLoading, error: renameError } = useFileRename();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await renameFile({
				path: getPath().path,
				name: item.name,
				newName: "trash",
			});
			onSuccess();
		} catch {
			setError(renameError || "削除に失敗しました");
		}
	};

	return (
		<Modal onClose={onClose}>
			<section>
				<div className="flex gap-2 items-center text-(--primary-color)">
					<Icon icon="line-md:trash" className="w-8 h-8" />
					<span className="text-2xl">削除</span>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="my-8 text-center">
						<p>削除しますか</p>
						{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
					</div>

					<div className="flex justify-center">
						<button
							type="submit"
							disabled={isLoading}
							className="block bg-(--primary-color) rounded-full m-auto py-2 px-12 cursor-pointer text-xl text-(--background-color) disabled:bg-(--text-color)"
						>
							OK
						</button>
					</div>
				</form>
			</section>
		</Modal>
	);
};

export default MoveToTrashModal;
