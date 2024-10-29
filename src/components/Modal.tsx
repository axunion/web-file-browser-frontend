import { useCallback, useEffect } from "react";
import "@/App.css";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={`fixed inset-0 bg-[#00000080] flex items-center justify-center z-50 ${
        isOpen ? "fade-in" : "fade-out"
      }`}
      onClick={onClose}
    >
      <div
        className="relative w-4/5 max-w-xs max-h-80vh p-5 rounded bg-amber-50 shadow-lg z-10"
        onClick={stopPropagation}
      >
        <button
          className="absolute top-3 right-3 text-amber-900"
          onClick={onClose}
          aria-label="Close Modal"
        >
          <div className="i-mdi-close-thick w-6 h-6"></div>
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
