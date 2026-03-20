import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { MESSAGES } from "@/constants/messages";
import useFileList from "@/hooks/useFileList";
import useFileMove from "@/hooks/useFileMove";
import type { DirectoryItem } from "@/types/api";
import { toEncodedPath } from "@/utils/path";

export type MoveModalProps = {
	item: DirectoryItem;
	currentPath: string;
	onClose: () => void;
	onSuccess: () => void;
};

const MoveModal = ({
	item,
	currentPath,
	onClose,
	onSuccess,
}: MoveModalProps) => {
	const [browsePaths, setBrowsePaths] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const { moveFile, isLoading } = useFileMove();
	const {
		items,
		isLoading: isLoadingDirs,
		setPath,
	} = useFileList("", {
		isolated: true,
	});

	const browsePath = useMemo(() => toEncodedPath(browsePaths), [browsePaths]);

	const directories = useMemo(
		() => items.filter((listItem) => listItem.type === "directory"),
		[items],
	);

	const handleNavigateUp = () => {
		const newPaths = browsePaths.slice(0, -1);
		setBrowsePaths(newPaths);
		setPath(toEncodedPath(newPaths));
	};

	const handleNavigateInto = (dirName: string) => {
		const newPaths = [...browsePaths, dirName];
		setBrowsePaths(newPaths);
		setPath(toEncodedPath(newPaths));
	};

	const handleMove = async () => {
		try {
			await moveFile({
				path: currentPath,
				name: item.name,
				destinationPath: browsePath || "/",
			});
			onSuccess();
		} catch (moveError) {
			setError(
				moveError instanceof Error
					? moveError.message
					: MESSAGES.FILE_MOVE_ERROR,
			);
		}
	};

	const canMove = browsePath !== currentPath;
	const displayPath =
		browsePaths.length > 0 ? `/${browsePaths.join("/")}` : "/";

	return (
		<Modal onClose={onClose}>
			<section>
				<div className="flex gap-2 items-center text-(--primary-color)">
					<Icon icon="mdi:folder-move-outline" className="w-8 h-8" />
					<span className="text-2xl">{MESSAGES.MOVE}</span>
				</div>

				<div className="my-4">
					<p className="text-sm text-gray-600 mb-2">
						{MESSAGES.SELECT_DESTINATION}
					</p>
					<div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded truncate">
						{displayPath}
					</div>
				</div>

				<div className="border rounded-md max-h-48 overflow-y-auto">
					{browsePaths.length > 0 && (
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
							{MESSAGES.LOADING}
						</div>
					) : directories.length === 0 ? (
						<div className="px-3 py-4 text-center text-gray-500">
							{MESSAGES.NO_DIRECTORIES}
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
						{MESSAGES.CONFIRM}
					</button>
				</div>
			</section>
		</Modal>
	);
};

export default MoveModal;
