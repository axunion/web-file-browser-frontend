import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";
import { MESSAGES } from "@/constants/messages";

export type ContextMenuProps = {
	position: { x: number; y: number };
	onClose: () => void;
	onRename: () => void;
	onMove?: () => void;
	onTrash: () => void;
};

const ContextMenu = ({
	onClose,
	onRename,
	onMove,
	onTrash,
	position,
}: ContextMenuProps) => {
	const buttonClasses =
		"w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer";
	const iconClasses = "w-5 h-5 text-[var(--primary-color)]";
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
		<div
			className="fixed inset-0 z-50"
			onPointerDown={onClose}
			role="presentation"
		>
			<div
				className="absolute overflow-hidden bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg shadow-md py-2"
				style={{
					left: `${menuPosition.left}px`,
					top: `${menuPosition.top}px`,
				}}
				onPointerDown={(e) => e.stopPropagation()}
				role="menu"
				aria-label={MESSAGES.FILE_ACTIONS}
			>
				<button
					type="button"
					className={buttonClasses}
					onClick={onRename}
					role="menuitem"
				>
					<Icon icon="mdi:rename-outline" className={iconClasses} />
					<span>{MESSAGES.RENAME}</span>
				</button>

				{onMove && (
					<button
						type="button"
						className={buttonClasses}
						onClick={onMove}
						role="menuitem"
					>
						<Icon icon="mdi:folder-move-outline" className={iconClasses} />
						<span>{MESSAGES.MOVE}</span>
					</button>
				)}

				<button
					type="button"
					className={buttonClasses}
					onClick={onTrash}
					role="menuitem"
				>
					<Icon icon="mdi:trash-can-outline" className={iconClasses} />
					<span>{MESSAGES.DELETE}</span>
				</button>
			</div>
		</div>,
		document.body,
	);
};

export default ContextMenu;
