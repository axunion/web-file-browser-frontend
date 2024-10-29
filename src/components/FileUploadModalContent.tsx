export type FileUploadModalContentProps = {
  files: File[];
  onUpload: () => void;
};

const FileUploadModalContent = ({
  files,
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

      <p className="my-8 text-sm">{files[0].name}</p>

      <button
        aria-label="Button"
        className={`bg-amber-700 w-full py-2 text-center text-xl text-white ${baseClasses}`}
        onClick={onUpload}
      >
        OK
      </button>
    </div>
  );
};

export default FileUploadModalContent;
