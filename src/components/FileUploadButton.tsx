import { ChangeEvent } from "react";

export type FileUploadButtonProps = {
  onFilesSelected?: (files: File[]) => void;
};

const FileUploadButton = ({ onFilesSelected }: FileUploadButtonProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    onFilesSelected?.(files);
    event.target.value = "";
  };

  return (
    <label className="cursor-pointer text-teal-200">
      <input
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
        aria-label="Upload files"
      />
      <div
        className="i-mdi-cloud-upload-outline w-6 h-6"
        aria-hidden="true"
      ></div>
    </label>
  );
};

export default FileUploadButton;
