import { useCallback } from "react";
import FileUploadButton from "@/components/FileUploadButton";
import FileUploadModalContent from "@/components/FileUploadModalContent";
import { useModal } from "@/hooks/modalContext";

const Header = () => {
  const { showModal, hideModal } = useModal();

  const upload = useCallback(
    (files: File[]) => {
      console.log(files);
      hideModal();
    },
    [hideModal]
  );

  const handleFileChange = useCallback(
    (files: File[]): void => {
      if (files.length === 0) {
        console.error("No files selected");
        return;
      }

      showModal(
        <FileUploadModalContent files={files} onUpload={() => upload(files)} />
      );
    },
    [showModal, upload]
  );

  return (
    <header className="flex justify-between p-4">
      <h1 className="flex items-center gap-2 text-xl tracking-wider">
        <span className="i-flat-color-icons-folder w-8 h-8"></span>
        <span>Web File Browser</span>
      </h1>

      <FileUploadButton onFilesSelected={handleFileChange} />
    </header>
  );
};

export default Header;
