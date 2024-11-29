import type { DirectoryItem } from "@/types/api";

export type FileItemProps = {
  file: DirectoryItem;
};

const iconClasses = {
  file: "i-flat-color-icons-file",
  directory: "i-flat-color-icons-folder",
  video: "i-flat-color-icons-video-file",
  audio: "i-flat-color-icons-audio-file",
  image: "i-flat-color-icons-image-file",
  text: "i-flat-color-icons-file",
};

const FileItem = ({ file }: FileItemProps) => {
  const iconClass = iconClasses[file.type] || null;

  const handleClick = () => {
    console.log(file);
  };

  return (
    <button
      aria-label={`File type is ${file.type}`}
      className="max-w-full mx-auto flex flex-col items-center justify-center p-2"
      onClick={handleClick}
    >
      {iconClass && (
        <span className={`w-16 h-16 ${iconClass}`} aria-hidden="true"></span>
      )}
      <span className=" mt-2 text-xs text-left line-clamp-2">{file.name}</span>
    </button>
  );
};

export default FileItem;
