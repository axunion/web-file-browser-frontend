import Modal from "@/components/Modal";

export type ErrorProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const ErrorModal = ({ isOpen, onClose, children }: ErrorProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section>
        <div className="flex gap-2 items-center">
          <span className="i-flat-color-icons-high-priority w-6 h-6"></span>
          <span className="text-xl">Error</span>
        </div>

        <p className="my-8 text-sm">{children}</p>
      </section>
    </Modal>
  );
};

export default ErrorModal;
