import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
	return createPortal(
		<div className={styles.overlay}>
			<Icon icon="eos-icons:loading" className={styles.icon} />
		</div>,
		document.body,
	);
};

export default LoadingSpinner;
