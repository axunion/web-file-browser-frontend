import { LoaderCircle } from "lucide-react";
import { createPortal } from "react-dom";
import { MESSAGES } from "@/constants/messages";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return createPortal(
    <div className={styles.overlay} role="status" aria-label={MESSAGES.LOADING}>
      <LoaderCircle className={`${styles.icon} spin`} />
    </div>,
    document.body,
  );
};

export default LoadingSpinner;
