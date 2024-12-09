export type FileUploadProps = {
  file: File;
  onUpload: () => void;
};

const FileUpload = ({ file, onUpload }: FileUploadProps) => {
  return (
    <section>
      <div className="flex gap-2 items-center">
        <span className="i-flat-color-icons-upload w-6 h-6"></span>
        <span className="text-xl">Upload</span>
      </div>

      <p className="my-8 text-sm">{file.name}</p>

      <button
        aria-label="Button"
        className="bg-[--primary-color] rounded w-full py-2 text-center text-xl text-[--background-color]"
        onClick={onUpload}
      >
        OK
      </button>
    </section>
  );
};

export default FileUpload;
