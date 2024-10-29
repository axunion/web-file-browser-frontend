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
    <header className="flex justify-between px-5 py-3 bg-amber-900 text-amber-50 shadow-md">
      <h1 className="text-lg tracking-wider">
        <span className="i-flat-color-icons-folder w-6 h-6 mr-2 inline-block align-text-bottom"></span>
        Web File Browser
      </h1>

      <FileUploadButton onFilesSelected={handleFileChange} />
    </header>
  );
};

export default Header;
