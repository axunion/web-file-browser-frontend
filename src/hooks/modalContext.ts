import { createContext, useContext } from "react";

export type ModalContextProps = {
  showModal: (content: React.ReactNode) => void;
  hideModal: () => void;
};

export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined
);

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal は ModalProvider 内で使用してください。");
  }

  return context;
};
