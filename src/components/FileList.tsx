import { memo, type RefObject, useState } from "react";
import ContextMenu from "@/components/ContextMenu";
import FileItem from "@/components/FileItem";
import RenameModal from "@/components/RenameModal";
import { ENDPOINT_DATA } from "@/constants/config";
import useLongPress from "@/hooks/useLongPress";
import type { DirectoryItem } from "@/types/api";
import { appendPath, getPath } from "@/utils/path";

export type FileListProps = {
	list: DirectoryItem[];
	onFileListUpdate?: () => void;
	isNavigatingRef: RefObject<boolean>;
};

const FileList = memo(
	({ list, onFileListUpdate, isNavigatingRef }: FileListProps) => {
		const dirPath = `${ENDPOINT_DATA}${getPath().path}/`;
		const gridClasses =
			"grid gap-x-2 gap-y-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";

		const [contextMenu, setContextMenu] = useState<{
			item: DirectoryItem;
			position: { x: number; y: number };
		} | null>(null);

		const [renameItem, setRenameItem] = useState<DirectoryItem | null>(null);

		const handleLongPress = (item: DirectoryItem, element: HTMLElement) => {
			try {
				const rect = element.getBoundingClientRect();
				const position = {
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2,
				};
				setContextMenu({ item, position });
			} catch (error) {
				console.error("Error getting element position:", error);
			}
		};

		const longPressHandlers = useLongPress<DirectoryItem>(handleLongPress, {
			delay: 300,
		});

		const handleClick = (item: DirectoryItem) => {
			if (isNavigatingRef.current) {
				return;
			}

			if (item.type === "directory") {
				isNavigatingRef.current = true;
				appendPath(item.name);

				setTimeout(() => {
					isNavigatingRef.current = false;
				}, 500);
			}
		};

		const handleContextMenuClose = () => {
			setContextMenu(null);
		};

		const handleRename = () => {
			if (contextMenu?.item) {
				setRenameItem(contextMenu.item);
			}
			setContextMenu(null);
		};

		const handleRenameModalClose = () => {
			setRenameItem(null);
		};

		const handleRenameSuccess = () => {
			setRenameItem(null);
			onFileListUpdate?.();
		};

		return (
			<div className={`fade-in ${gridClasses}`}>
				{list.map((item, index) => (
					<button
						key={`${item.name}-${index}`}
						type="button"
						className="max-w-full mx-auto flex flex-col items-center justify-start cursor-pointer"
						aria-label={`File type is ${item.type}`}
						onClick={() => handleClick(item)}
						onMouseDown={longPressHandlers.onMouseDown(item)}
						onMouseUp={longPressHandlers.onMouseUp}
						onMouseLeave={longPressHandlers.onMouseLeave}
						onTouchStart={longPressHandlers.onTouchStart(item)}
						onTouchEnd={longPressHandlers.onTouchEnd}
					>
						<FileItem file={item} dirPath={dirPath} />
					</button>
				))}

				{contextMenu && (
					<ContextMenu
						position={contextMenu.position}
						onClose={handleContextMenuClose}
						onRename={handleRename}
					/>
				)}

				{renameItem && (
					<RenameModal
						item={renameItem}
						onClose={handleRenameModalClose}
						onSuccess={handleRenameSuccess}
					/>
				)}
			</div>
		);
	},
);

export default FileList;
