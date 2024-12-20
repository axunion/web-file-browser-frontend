import { Icon } from "@iconify/react";
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		},
		[isOpen, onClose],
	);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	if (!isOpen) return null;

	const stopPropagation = (e: React.SyntheticEvent) => {
		e.stopPropagation();
	};

	return createPortal(
		<div
			className={`fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 ${
				isOpen ? "fade-in" : "fade-out"
			}`}
			onClick={() => {}}
			onKeyDown={onClose}
		>
			<div
				className="relative w-4/5 max-w-xs max-h-80vh p-5 rounded bg-[--background-color] shadow-lg z-10"
				onClick={() => {}}
				onKeyDown={stopPropagation}
			>
				<button
					type="button"
					className="absolute top-3 right-3 text-[--accent-color]"
					onClick={onClose}
					aria-label="Close Modal"
				>
					<Icon icon="mdi:close-thick" className="w-6 h-6" />
				</button>

				{children}
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
