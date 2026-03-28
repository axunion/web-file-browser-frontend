import { Icon } from "@iconify/react";
import { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MESSAGES } from "@/constants/messages";
import type { ToastItem, ToastType } from "@/hooks/useToast";
import styles from "./Toast.module.css";

const TOAST_DURATION_MS = 4000;

const ICON_BY_TYPE: Record<ToastType, string> = {
	error: "flat-color-icons:high-priority",
	success: "line-md:confirm-circle",
	warning: "line-md:alert",
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
			<Icon
				icon={ICON_BY_TYPE[toast.type]}
				className={styles.icon}
				aria-hidden
			/>
			<span className={styles.message}>{toast.message}</span>
			<button
				type="button"
				className={styles.dismissButton}
				aria-label={MESSAGES.DISMISS_TOAST}
				onClick={dismiss}
			>
				<Icon icon="line-md:close" width={16} height={16} aria-hidden />
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
		<div className={styles.container} aria-live="assertive">
			{toasts.map((toast) => (
				<ToastEntry key={toast.id} toast={toast} onDismiss={onDismiss} />
			))}
		</div>,
		document.body,
	);
});

export default Toast;
