import { useCallback } from "react";
import Button from "@/components/Button";
import FileUploadButton from "@/components/FileUploadButton";
import { useModal } from "@/hooks/modalContext";

export type UploadModalContentProps = {
  files: File[];
  onUpload: () => void;
};

const UploadModalContent = ({ files, onUpload }: UploadModalContentProps) => (
  <div>
    <h2 className="flex gap-2 items-center">
      <span className="i-flat-color-icons-upload w-6 h-6"></span>
      <span className="text-xl">Upload</span>
    </h2>

    <p className="my-8 text-sm">{files[0].name}</p>

    <Button size="large" className="w-full text-center" onClick={onUpload}>
      OK
    </Button>
  </div>
);

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
        <UploadModalContent files={files} onUpload={() => upload(files)} />
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
