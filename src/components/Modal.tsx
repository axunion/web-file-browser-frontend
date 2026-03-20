import { Icon } from "@iconify/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MESSAGES } from "@/constants/messages";

export type ModalProps = {
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
};

const Modal = ({ onClose, children, title }: ModalProps) => {
	const [isClosing, setIsClosing] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<Element | null>(null);

	const close = useCallback(() => setIsClosing(true), []);

	const handleAnimationEnd = () => {
		if (isClosing) {
			onClose();
		}
	};

	useEffect(() => {
		previousActiveElement.current = document.activeElement;

		modalRef.current?.focus();

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			if (previousActiveElement.current instanceof HTMLElement) {
				previousActiveElement.current.focus();
			}
		};
	}, [close]);

	return createPortal(
		<div
			className={`fixed inset-0 bg-[#00000080] flex items-center justify-center z-10 ${
				isClosing ? "fade-out" : "fade-in"
			}`}
			onPointerDown={close}
			onAnimationEnd={handleAnimationEnd}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? "modal-title" : undefined}
		>
			<div
				ref={modalRef}
				tabIndex={-1}
				className="relative w-4/5 max-w-xs max-h-80vh p-6 rounded-sm bg-(--background-color) shadow-lg focus:outline-none"
				onPointerDown={(e) => e.stopPropagation()}
			>
				{title && (
					<h2 id="modal-title" className="sr-only">
						{title}
					</h2>
				)}
				{children}

				<button
					type="button"
					className="absolute top-4 right-4 cursor-pointer"
					onClick={close}
					aria-label={MESSAGES.CLOSE_MODAL}
				>
					<Icon icon="mdi:close-thick" className="w-6 h-6" />
				</button>
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
