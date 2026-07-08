import { Icon } from "@iconify/react";
import { createPortal } from "react-dom";
import { MESSAGES } from "@/constants/messages";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return createPortal(
    <div className={styles.overlay} role="status" aria-label={MESSAGES.LOADING}>
      <Icon icon="eos-icons:loading" className={styles.icon} />
    </div>,
    document.body,
  );
};

export default LoadingSpinner;
