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
    <label className="cursor-pointer text-[--accent-color]">
      <input
        type="file"
        aria-label="Upload files"
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
      <div
        className="i-mdi-cloud-upload-outline w-8 h-8"
        aria-hidden="true"
      ></div>
    </label>
  );
};

export default FileUploadButton;
