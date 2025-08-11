import FileItem from "@/components/FileItem";
import ContextMenu from "@/components/ContextMenu";
import { ENDPOINT_DATA } from "@/constants/config";
import type { DirectoryItem } from "@/types/api";
import { appendPath, getPath } from "@/utils/path";
import { Icon } from "@iconify/react";
import { memo, useRef, useState, useEffect } from "react";

export type FileListProps = {
	list: DirectoryItem[];
};

const FileList = memo(({ list }: FileListProps) => {
	const dirPath = `${ENDPOINT_DATA}${getPath().path}/`;
	const gridClasses =
		"grid gap-x-2 gap-y-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [contextMenu, setContextMenu] = useState<{
		item: DirectoryItem;
		position: { x: number; y: number };
	} | null>(null);

	const handleClick = (item: DirectoryItem) => {
		if (item.type === "directory") {
			appendPath(item.name);
		}
	};

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

	const startLongPress = (
		item: DirectoryItem,
		event: React.MouseEvent | React.TouchEvent,
	) => {
		event.preventDefault();

		if (timeoutRef.current) clearTimeout(timeoutRef.current);

		const element = event.currentTarget as HTMLElement;

		if (!element) return;

		timeoutRef.current = setTimeout(() => handleLongPress(item, element), 300);
	};

	const clearLongPress = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};

	const handleContextMenuClose = () => {
		setContextMenu(null);
	};

	const handleRename = () => {
		console.log(contextMenu?.item);
		setContextMenu(null);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, []);

	return (
		<div className={`fade-in ${gridClasses}`}>
			{list.map((item, index) => (
				<button
					key={`${item.name}-${index}`}
					type="button"
					className="max-w-full mx-auto flex flex-col items-center justify-center p-2 cursor-pointer"
					aria-label={`File type is ${item.type}`}
					onClick={() => handleClick(item)}
					onMouseDown={(e) => startLongPress(item, e)}
					onMouseUp={clearLongPress}
					onMouseLeave={clearLongPress}
					onTouchStart={(e) => startLongPress(item, e)}
					onTouchEnd={clearLongPress}
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
