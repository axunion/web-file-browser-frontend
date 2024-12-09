import { useCallback, useState } from "react";
import FileUpload from "@/components/FileUpload";
import FileUploadButton from "@/components/FileUploadButton";
import Modal from "@/components/Modal";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (files: File[]): void => {
    if (files.length === 0) {
      console.error("No files selected");
      return;
    }

    setFiles(files);
    setIsModalOpen(true);
  };

  const upload = useCallback(() => {
    console.log(files);
    setFiles([]);
    setIsModalOpen(false);
  }, [files]);

  return (
    <>
      <header className="flex justify-between p-4">
        <h1 className="flex items-center gap-2 text-xl tracking-wider">
          <span className="i-flat-color-icons-folder w-8 h-8"></span>
          <span>Web File Browser</span>
        </h1>

        <FileUploadButton onFilesSelected={handleFileChange} />
      </header>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FileUpload file={files[0]} onUpload={upload} />
      </Modal>
    </>
  );
};

export default Header;
