import type { DirectoryItem } from "@/types/api";

export type FileItemProps = {
  file: DirectoryItem;
};

type FileType = "directory" | "file" | "video" | "audio" | "image" | "text";

const iconClasses = {
  directory: "i-flat-color-icons-folder",
  file: "i-flat-color-icons-file",
  video: "i-flat-color-icons-video-file",
  audio: "i-flat-color-icons-audio-file",
  image: "i-flat-color-icons-image-file",
  text: "i-flat-color-icons-file",
};

const getFileType = (name: string): FileType => {
  const extension = name.toLowerCase().split(".").pop() || "";
  const videoExtensions = ["mp4", "mov", "avi", "wmv", "flv", "mkv", "webm"];
  const audioExtensions = ["mp3", "wav", "aac", "ogg", "m4a", "wma"];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];
  const textExtensions = ["txt", "doc", "docx", "pdf", "rtf", "md"];

  if (videoExtensions.includes(extension)) {
    return "video";
  } else if (audioExtensions.includes(extension)) {
    return "audio";
  } else if (imageExtensions.includes(extension)) {
    return "image";
  } else if (textExtensions.includes(extension)) {
    return "text";
  }

  return "file";
};

const FileItem = ({ file }: FileItemProps) => {
  let fileType: FileType;

  if (file.type === "directory") {
    fileType = "directory";
  } else {
    fileType = getFileType(file.name);
  }

  const iconClass = iconClasses[fileType];

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
