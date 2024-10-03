import { useState } from "react";
import { ModalContext } from "@/hooks/modalContext";
import Modal from "@/components/Modal";

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const showModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={hideModal}>
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
};

export default ModalProvider;
