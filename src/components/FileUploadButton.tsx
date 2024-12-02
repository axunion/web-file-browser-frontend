import { ChangeEvent } from "react";

export type FileUploadButtonProps = {
  onFilesSelected: (files: File[]) => void;
};

const FileUploadButton = ({ onFilesSelected }: FileUploadButtonProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    onFilesSelected(files);
    event.target.value = "";
  };

  return (
    <label
      className="cursor-pointer text-[--accent-color]"
      role="button"
      tabIndex={0}
    >
      <input
        type="file"
        aria-label="Click to upload files"
        className="hidden"
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
