export type FileUploadModalContentProps = {
  file: File;
  onUpload: () => void;
};

const FileUploadModalContent = ({
  file,
  onUpload,
}: FileUploadModalContentProps) => {
  const baseClasses =
    "rounded transition-colors duration-200 focus:outline-none";

  return (
    <div>
      <h2 className="flex gap-2 items-center">
        <span className="i-flat-color-icons-upload w-6 h-6"></span>
        <span className="text-xl">Upload</span>
      </h2>

      <p className="my-8 text-sm">{file.name}</p>

      <button
        aria-label="Button"
        className={`bg-[--primary-color] w-full py-2 text-center text-xl text-[--background-color] ${baseClasses}`}
        onClick={onUpload}
      >
        OK
      </button>
    </div>
  );
};

export default FileUploadModalContent;
