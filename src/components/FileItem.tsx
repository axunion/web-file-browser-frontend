export type File = {
  name: string;
  type: "folder" | "video" | "audio" | "image" | "text";
};

export type FileItemProps = {
  file: File;
};

const iconClasses = {
  folder: "i-flat-color-icons-folder",
  video: "i-flat-color-icons-video-file",
  audio: "i-flat-color-icons-audio-file",
  image: "i-flat-color-icons-image-file",
  text: "i-flat-color-icons-file",
};

const FileItem = ({ file }: FileItemProps) => {
  const renderIcon = () => {
    const iconClass = iconClasses[file.type] || null;
    return iconClass ? <div className={`w-18 h-18 ${iconClass}`}></div> : null;
  };

  return (
    <button className="py-5 flex flex-col items-center">
      {renderIcon()}
      <p className="mt-2 text-center text-sm break-all">{file.name}</p>
    </button>
  );
};

export default FileItem;
