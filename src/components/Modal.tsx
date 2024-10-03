type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative w-4/5 max-w-xs max-h-full p-6 rounded bg-amber-50 shadow-lg z-10">
        <button
          className="absolute top-2 right-2 text-amber-900"
          onClick={onClose}
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;