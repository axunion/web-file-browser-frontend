export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-4/5 max-w-xs max-h-80vh p-5 rounded bg-amber-50 shadow-lg z-10"
        onClick={stopPropagation}
      >
        <button
          className="absolute top-3 right-3 text-amber-900"
          onClick={onClose}
        >
          <div className="i-mdi-close-thick w-6 h-6"></div>
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
