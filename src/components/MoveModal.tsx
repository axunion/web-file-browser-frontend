import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import Modal from "@/components/Modal";
import useFileList from "@/hooks/useFileList";
import useFileMove from "@/hooks/useFileMove";
import type { DirectoryItem } from "@/types/api";
import { getPath } from "@/utils/path";

export type MoveModalProps = {
	item: DirectoryItem;
	onClose: () => void;
	onSuccess: () => void;
};

const MoveModal = ({ item, onClose, onSuccess }: MoveModalProps) => {
	const currentPath = getPath().path;
	const [browsePath, setBrowsePath] = useState("");
	const [error, setError] = useState<string | null>(null);
	const { moveFile, isLoading, error: moveError } = useFileMove();
	const { fileList, isLoading: isLoadingDirs, fetchFileList } = useFileList("");

	const directories = useMemo(
		() => fileList.filter((item) => item.type === "directory"),
		[fileList],
	);

	const handleNavigateUp = () => {
		const parts = browsePath.split("/").filter(Boolean);
		parts.pop();
		const newPath = parts.join("/");
		setBrowsePath(newPath);
		fetchFileList(newPath);
	};

	const handleNavigateInto = (dirName: string) => {
		const newPath = browsePath ? `${browsePath}/${dirName}` : dirName;
		setBrowsePath(newPath);
		fetchFileList(newPath);
	};

	const handleMove = async () => {
		try {
			await moveFile({
				path: currentPath,
				name: item.name,
				destinationPath: browsePath,
			});
			onSuccess();
		} catch {
			setError(moveError || "移動に失敗しました");
		}
	};

	const canMove = useMemo(() => {
		return browsePath !== currentPath;
	}, [browsePath, currentPath]);

	const displayPath = browsePath || "/";

	return (
		<Modal onClose={onClose}>
			<section>
				<div className="flex gap-2 items-center text-(--primary-color)">
					<Icon icon="mdi:folder-move-outline" className="w-8 h-8" />
					<span className="text-2xl">Move</span>
				</div>

				<div className="my-4">
					<p className="text-sm text-gray-600 mb-2">移動先を選択</p>
					<div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded truncate">
						{displayPath}
					</div>
				</div>

				<div className="border rounded-md max-h-48 overflow-y-auto">
					{browsePath && (
						<button
							type="button"
							className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 border-b cursor-pointer"
							onClick={handleNavigateUp}
						>
							<Icon
								icon="mdi:folder-open"
								className="w-5 h-5 text-yellow-500"
							/>
							<span>..</span>
						</button>
					)}

					{isLoadingDirs ? (
						<div className="px-3 py-4 text-center text-gray-500">
							読み込み中...
						</div>
					) : directories.length === 0 ? (
						<div className="px-3 py-4 text-center text-gray-500">
							ディレクトリがありません
						</div>
					) : (
						directories
							.filter(
								(dir) =>
									!(browsePath === currentPath && dir.name === item.name),
							)
							.map((dir) => (
								<button
									key={dir.name}
									type="button"
									className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
									onClick={() => handleNavigateInto(dir.name)}
								>
									<Icon icon="mdi:folder" className="w-5 h-5 text-yellow-500" />
									<span className="truncate">{dir.name}</span>
								</button>
							))
					)}
				</div>

				{error && <p className="mt-2 text-sm text-red-600">{error}</p>}

				<div className="flex justify-center mt-6">
					<button
						type="button"
						onClick={handleMove}
						disabled={isLoading || !canMove}
						className="block bg-(--primary-color) rounded-full m-auto py-2 px-8 cursor-pointer text-xl text-(--background-color) disabled:bg-(--text-color)"
					>
						OK
					</button>
				</div>
			</section>
		</Modal>
	);
};

export default MoveModal;
