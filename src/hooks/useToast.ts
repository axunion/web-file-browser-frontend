import { useCallback, useState } from "react";

export type ToastType = "error" | "success" | "warning";

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

type UseToastReturn = {
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string) => void;
  dismissToast: (id: string) => void;
};

const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
};

export default useToast;
