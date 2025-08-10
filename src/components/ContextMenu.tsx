import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";

export type ContextMenuAction = "rename" | "delete";

export type ContextMenuProps = {
	onClose: () => void;
	onAction: (action: ContextMenuAction) => void;
	position: { x: number; y: number };
};

const ContextMenu = ({ onClose, onAction, position }: ContextMenuProps) => {
	const handleAction = (action: ContextMenuAction) => {
		onAction(action);
		onClose();
	};

	const menuItems = [
		{
			action: "rename" as const,
			icon: "mdi:rename-box",
			label: "リネーム",
		},
		{
			action: "delete" as const,
			icon: "mdi:delete",
			label: "削除",
		},
	];

	const calculatePosition = () => {
		const menuWidth = 140;
		const windowWidth = typeof window !== "undefined" ? window.innerWidth : 800;

		return {
			left: Math.max(
				8,
				Math.min(position.x - menuWidth / 2, windowWidth - menuWidth - 8),
			),
			top: position.y + 8,
		};
	};

	const menuPosition = calculatePosition();

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
				{menuItems.map((item) => (
					<button
						key={item.action}
						type="button"
						className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
						onClick={() => handleAction(item.action)}
					>
						<Icon icon={item.icon} className="w-4 h-4" />
						<span>{item.label}</span>
					</button>
				))}
			</div>
		</div>,
		document.body,
	);
};

export default ContextMenu;
