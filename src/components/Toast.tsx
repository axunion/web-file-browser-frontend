import {
  CircleAlert,
  CircleCheck,
  type LucideIcon,
  TriangleAlert,
  X,
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MESSAGES } from "@/constants/messages";
import type { ToastItem, ToastType } from "@/hooks/useToast";
import styles from "./Toast.module.css";

const TOAST_DURATION_MS = 4000;

const ICON_BY_TYPE: Record<ToastType, LucideIcon> = {
  error: CircleAlert,
  success: CircleCheck,
  warning: TriangleAlert,
};

const STYLE_BY_TYPE: Record<ToastType, string> = {
  error: styles.toastError,
  success: styles.toastSuccess,
  warning: styles.toastWarning,
};

type ToastEntryProps = {
  toast: ToastItem;
  onDismiss: (id: string) => void;
};

const ToastEntry = memo(({ toast, onDismiss }: ToastEntryProps) => {
  const Icon = ICON_BY_TYPE[toast.type];
  const [isDismissing, setIsDismissing] = useState(false);

  const dismiss = () => {
    setIsDismissing(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsDismissing(true), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (isDismissing && e.target === e.currentTarget) {
      onDismiss(toast.id);
    }
  };

  return (
    <div
      role="alert"
      className={`${styles.toast} ${STYLE_BY_TYPE[toast.type]} ${isDismissing ? styles.dismissing : ""}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <Icon className={styles.icon} />
      <span className={styles.message}>{toast.message}</span>
      <button
        type="button"
        className={styles.dismissButton}
        aria-label={MESSAGES.DISMISS_TOAST}
        onClick={dismiss}
      >
        <X size={16} />
      </button>
    </div>
  );
});

export type ToastProps = {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
};

const Toast = memo(({ toasts, onDismiss }: ToastProps) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastEntry key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  );
});

export default Toast;
