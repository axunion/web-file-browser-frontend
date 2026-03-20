import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";
import { MESSAGES } from "@/constants/messages";
import styles from "./ContextMenu.module.css";

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
		<div className={styles.overlay} onPointerDown={onClose} role="presentation">
			<div
				className={styles.menu}
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
					className={styles.button}
					onClick={onRename}
					role="menuitem"
				>
					<Icon icon="mdi:rename-outline" className={styles.icon} />
					<span>{MESSAGES.RENAME}</span>
				</button>

				{onMove && (
					<button
						type="button"
						className={styles.button}
						onClick={onMove}
						role="menuitem"
					>
						<Icon icon="mdi:folder-move-outline" className={styles.icon} />
						<span>{MESSAGES.MOVE}</span>
					</button>
				)}

				<button
					type="button"
					className={styles.button}
					onClick={onTrash}
					role="menuitem"
				>
					<Icon icon="mdi:trash-can-outline" className={styles.icon} />
					<span>{MESSAGES.DELETE}</span>
				</button>
			</div>
		</div>,
		document.body,
	);
};

export default ContextMenu;
