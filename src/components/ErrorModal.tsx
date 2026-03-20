import { Icon } from "@iconify/react";
import Modal from "@/components/Modal";
import { MESSAGES } from "@/constants/messages";
import styles from "./ErrorModal.module.css";

export type ErrorProps = {
	onClose: () => void;
	children: React.ReactNode;
};

const ErrorModal = ({ onClose, children }: ErrorProps) => {
	return (
		<Modal onClose={onClose}>
			<section>
				<div className={styles.header}>
					<Icon icon="flat-color-icons:high-priority" className={styles.icon} />
					<span className={styles.title}>{MESSAGES.ERROR}</span>
				</div>

				<p className={styles.message}>{children}</p>
			</section>
		</Modal>
	);
};

export default ErrorModal;
