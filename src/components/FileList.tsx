import { memo, type RefObject, useCallback, useReducer } from "react";
import ContextMenu from "@/components/ContextMenu";
import FileItem from "@/components/FileItem";
import MoveModal from "@/components/MoveModal";
import MoveToTrashModal from "@/components/MoveToTrashModal";
import RenameModal from "@/components/RenameModal";
import { ENDPOINT_DATA } from "@/constants/config";
import { getFileItemAriaLabel } from "@/constants/messages";
import useLongPress from "@/hooks/useLongPress";
import type { DirectoryItem } from "@/types/api";
import { appendPath } from "@/utils/path";
import styles from "./FileList.module.css";

export type FileListProps = {
	list: DirectoryItem[];
	currentPath: string;
	onFileListUpdate?: () => void;
	isNavigatingRef: RefObject<boolean>;
};

type FileListState = {
	contextMenu: {
		item: DirectoryItem;
		position: { x: number; y: number };
	} | null;
	activeModal: {
		type: "rename" | "move" | "trash";
		item: DirectoryItem;
	} | null;
};

type FileListAction =
	| {
			type: "OPEN_CONTEXT_MENU";
			item: DirectoryItem;
			position: { x: number; y: number };
	  }
	| { type: "CLOSE_CONTEXT_MENU" }
	| { type: "OPEN_RENAME_MODAL" }
	| { type: "OPEN_MOVE_MODAL" }
	| { type: "OPEN_TRASH_MODAL" }
	| { type: "CLOSE_MODAL" };

const initialState: FileListState = {
	contextMenu: null,
	activeModal: null,
};

const fileListReducer = (
	state: FileListState,
	action: FileListAction,
): FileListState => {
	switch (action.type) {
		case "OPEN_CONTEXT_MENU":
			return {
				...state,
				contextMenu: { item: action.item, position: action.position },
			};
		case "CLOSE_CONTEXT_MENU":
			return { ...state, contextMenu: null };
		case "OPEN_RENAME_MODAL":
			if (!state.contextMenu) return state;
			return {
				contextMenu: null,
				activeModal: { type: "rename", item: state.contextMenu.item },
			};
		case "OPEN_MOVE_MODAL":
			if (!state.contextMenu) return state;
			return {
				contextMenu: null,
				activeModal: { type: "move", item: state.contextMenu.item },
			};
		case "OPEN_TRASH_MODAL":
			if (!state.contextMenu) return state;
			return {
				contextMenu: null,
				activeModal: { type: "trash", item: state.contextMenu.item },
			};
		case "CLOSE_MODAL":
			return { ...state, activeModal: null };
		default:
			return state;
	}
};

const FileList = memo(
	({ list, currentPath, onFileListUpdate, isNavigatingRef }: FileListProps) => {
		const [state, dispatch] = useReducer(fileListReducer, initialState);
		const { contextMenu, activeModal } = state;

		const dirPath = currentPath
			? `${ENDPOINT_DATA}${currentPath}/`
			: ENDPOINT_DATA;

		const handleLongPress = useCallback(
			(item: DirectoryItem, element: HTMLElement) => {
				try {
					const rect = element.getBoundingClientRect();
					const position = {
						x: rect.left + rect.width / 2,
						y: rect.top + rect.height / 2,
					};
					dispatch({ type: "OPEN_CONTEXT_MENU", item, position });
				} catch (error) {
					console.error("Error getting element position:", error);
				}
			},
			[],
		);

		const longPressHandlers = useLongPress<DirectoryItem>(handleLongPress, {
			delay: 300,
		});

		const handleClick = useCallback(
			(item: DirectoryItem) => {
				if (isNavigatingRef.current) {
					return;
				}

				if (item.type === "directory") {
					isNavigatingRef.current = true;
					appendPath(item.name);

					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							isNavigatingRef.current = false;
						});
					});
				}
			},
			[isNavigatingRef],
		);

		const handleContextMenuClose = useCallback(() => {
			dispatch({ type: "CLOSE_CONTEXT_MENU" });
		}, []);

		const handleRename = useCallback(() => {
			dispatch({ type: "OPEN_RENAME_MODAL" });
		}, []);

		const handleMove = useCallback(() => {
			dispatch({ type: "OPEN_MOVE_MODAL" });
		}, []);

		const handleTrash = useCallback(() => {
			dispatch({ type: "OPEN_TRASH_MODAL" });
		}, []);

		const handleModalClose = useCallback(() => {
			dispatch({ type: "CLOSE_MODAL" });
		}, []);

		const handleActionSuccess = useCallback(() => {
			dispatch({ type: "CLOSE_MODAL" });
			onFileListUpdate?.();
		}, [onFileListUpdate]);

		return (
			<div className={`fade-in ${styles.list}`}>
				{list.map((item) => (
					<button
						key={item.name}
						type="button"
						className={styles.itemButton}
						aria-label={getFileItemAriaLabel(item.name, item.type)}
						onClick={() => handleClick(item)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleClick(item);
							}
						}}
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
						onMove={contextMenu.item.type === "file" ? handleMove : undefined}
						onTrash={handleTrash}
					/>
				)}

				{activeModal?.type === "rename" && (
					<RenameModal
						item={activeModal.item}
						currentPath={currentPath}
						onClose={handleModalClose}
						onSuccess={handleActionSuccess}
					/>
				)}

				{activeModal?.type === "move" && (
					<MoveModal
						item={activeModal.item}
						currentPath={currentPath}
						onClose={handleModalClose}
						onSuccess={handleActionSuccess}
					/>
				)}

				{activeModal?.type === "trash" && (
					<MoveToTrashModal
						item={activeModal.item}
						currentPath={currentPath}
						onClose={handleModalClose}
						onSuccess={handleActionSuccess}
					/>
				)}
			</div>
		);
	},
);

export default FileList;
