import { Icon } from "@iconify/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MESSAGES } from "@/constants/messages";
import styles from "./Modal.module.css";

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
			className={`${styles.overlay} ${isClosing ? "fade-out" : "fade-in"}`}
			onPointerDown={close}
			onAnimationEnd={handleAnimationEnd}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? "modal-title" : undefined}
		>
			<div
				ref={modalRef}
				tabIndex={-1}
				className={styles.panel}
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
					className={styles.closeButton}
					onClick={close}
					aria-label={MESSAGES.CLOSE_MODAL}
				>
					<Icon icon="mdi:close-thick" className={styles.closeIcon} />
				</button>
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
