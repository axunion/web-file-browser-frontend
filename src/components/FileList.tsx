import { Icon } from "@iconify/react";
import { memo, useState } from "react";
import ContextMenu from "@/components/ContextMenu";
import FileItem from "@/components/FileItem";
import { ENDPOINT_DATA } from "@/constants/config";
import useLongPress from "@/hooks/useLongPress";
import type { DirectoryItem } from "@/types/api";
import { appendPath, getPath } from "@/utils/path";

export type FileListProps = {
	list: DirectoryItem[];
};

const FileList = memo(({ list }: FileListProps) => {
	const dirPath = `${ENDPOINT_DATA}${getPath().path}/`;
	const gridClasses =
		"grid gap-x-2 gap-y-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";

	const [contextMenu, setContextMenu] = useState<{
		item: DirectoryItem;
		position: { x: number; y: number };
	} | null>(null);

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
		if (item.type === "directory") {
			appendPath(item.name);
		}
	};

	const handleContextMenuClose = () => {
		setContextMenu(null);
	};

	const handleRename = () => {
		console.log(contextMenu?.item);
		setContextMenu(null);
	};

	return (
		<div className={`fade-in ${gridClasses}`}>
			{list.map((item, index) => (
				<button
					key={`${item.name}-${index}`}
					type="button"
					className="max-w-full mx-auto flex flex-col items-center justify-center p-2 cursor-pointer"
					aria-label={`File type is ${item.type}`}
					onClick={() => handleClick(item)}
					onMouseDown={longPressHandlers.onMouseDown(item)}
					onMouseUp={longPressHandlers.onMouseUp}
					onMouseLeave={longPressHandlers.onMouseLeave}
					onTouchStart={longPressHandlers.onTouchStart(item)}
					onTouchEnd={longPressHandlers.onTouchEnd}
				>
					{item.type === "directory" ? (
						<Icon icon="flat-color-icons:folder" className="w-16 h-16" />
					) : (
						<FileItem file={item} dirPath={dirPath} />
					)}

					<div className="line-clamp-2 px-2 text-xs text-left break-all">
						{item.name}
					</div>
				</button>
			))}

			{contextMenu && (
				<ContextMenu
					position={contextMenu.position}
					onClose={handleContextMenuClose}
					onRename={handleRename}
				/>
			)}
		</div>
	);
});

export default FileList;
