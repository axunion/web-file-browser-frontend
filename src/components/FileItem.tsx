export type File = {
  name: string;
  type: "folder" | "video" | "audio" | "image" | "text";
};

export type FileItemProps = {
  file: File;
  onClick?: (file: File) => void;
};

const iconClasses = {
  folder: "i-flat-color-icons-folder",
  video: "i-flat-color-icons-video-file",
  audio: "i-flat-color-icons-audio-file",
  image: "i-flat-color-icons-image-file",
  text: "i-flat-color-icons-file",
};

const FileItem = ({ file, onClick }: FileItemProps) => {
  const iconClass = iconClasses[file.type] || null;

  const handleClick = () => {
    if (onClick) {
      onClick(file);
    }
  };

  return (
    <button
      className="py-5 flex flex-col items-center"
      onClick={handleClick}
      aria-label={`File type is ${file.type}`}
    >
      {iconClass && (
        <div className={`w-16 h-16 ${iconClass}`} aria-hidden="true"></div>
      )}
      <p className="mt-2 text-center text-sm break-all truncate w-full">
        {file.name}
      </p>
    </button>
  );
};

export default FileItem;
