import { ChangeEvent } from "react";

export type FileUploadButtonProps = {
  onFilesSelected?: (files: File[]) => void;
};

const FileUploadButton = ({ onFilesSelected }: FileUploadButtonProps) => {
  const handleFileChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    if (onFilesSelected) {
      onFilesSelected(files);
    }
  };

  return (
    <label className="cursor-pointer text-teal-200">
      <input
        type="file"
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
      <div className="i-mdi-cloud-upload-outline w-6 h-6"></div>
    </label>
  );
};

export default FileUploadButton;
