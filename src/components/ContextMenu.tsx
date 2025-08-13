import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";

export type ContextMenuProps = {
	position: { x: number; y: number };
	onClose: () => void;
	onRename: () => void;
};

const ContextMenu = ({ onClose, onRename, position }: ContextMenuProps) => {
	const buttonClasses =
		"w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer";
	const menuWidth = 140;
	const windowWidth = typeof window !== "undefined" ? window.innerWidth : 800;
	const menuPosition = {
		left: Math.max(
			8,
			Math.min(position.x - menuWidth / 2, windowWidth - menuWidth - 8),
		),
		top: position.y + 8,
	};

	return createPortal(
		<div className="fixed inset-0 z-50" onPointerDown={onClose}>
			<div
				className="absolute overflow-hidden bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg shadow-md py-2"
				style={{
					left: `${menuPosition.left}px`,
					top: `${menuPosition.top}px`,
				}}
				onPointerDown={(e) => e.stopPropagation()}
			>
				<button type="button" className={buttonClasses} onClick={onRename}>
					<Icon icon="mdi:rename-outline" className="w-4 h-4" />
					<span>リネーム</span>
				</button>
			</div>
		</div>,
		document.body,
	);
};

export default ContextMenu;
