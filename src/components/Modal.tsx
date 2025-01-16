import { Icon } from "@iconify/react";
import { useState } from "react";
import { createPortal } from "react-dom";

export type ModalProps = {
	onClose: () => void;
	children: React.ReactNode;
};

const Modal = ({ onClose, children }: ModalProps) => {
	const [isOpen, setIsOpen] = useState(true);
	const stopPropagation = (e: React.KeyboardEvent) => e.stopPropagation();
	const close = () => setIsOpen(false);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			close();
		}
	};

	const handleAnimationEnd = () => {
		if (!isOpen) {
			onClose();
		}
	};

	return createPortal(
		<div
			className={`fixed inset-0 bg-[#00000080] flex items-center justify-center z-10 ${
				isOpen ? "fade-in" : "fade-out"
			}`}
			onClick={() => {}}
			onKeyDown={handleKeyDown}
			onAnimationEnd={handleAnimationEnd}
		>
			<div
				className="relative w-4/5 max-w-xs max-h-80vh p-5 rounded bg-[--background-color] shadow-lg"
				onClick={() => {}}
				onKeyDown={stopPropagation}
			>
				{children}

				<button
					type="button"
					className="absolute top-3 right-3 text-[--accent-color]"
					onClick={close}
					aria-label="Close Modal"
				>
					<Icon icon="mdi:close-thick" className="w-6 h-6" />
				</button>
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
