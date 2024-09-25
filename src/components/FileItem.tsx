export type File = {
  id: number;
  name: string;
  type: "folder" | "video" | "image" | "text";
};

function FileItem({ file }: { file: File }) {
  const renderIcon = () => {
    switch (file.type) {
      case "folder":
        return <div className="w-16 h-16 i-mdi-folder"></div>;
      case "video":
        return <div className="w-16 h-16 i-mdi-file-video"></div>;
      case "image":
        return <div className="w-16 h-16 i-mdi-file-image"></div>;
      default:
        return <div className="w-16 h-16 i-mdi-file-document"></div>;
    }
  };

  return (
    <div className="py-4 flex flex-col items-center">
      {renderIcon()}
      <p className="mt-2 text-center text-sm break-all">{file.name}</p>
    </div>
  );
}

export default FileItem;
