export type File = {
  id: number;
  name: string;
  type: string;
};

function FileItem({ file }: { file: File }) {
  const renderIcon = () => {
    switch (file.type) {
      case "folder":
        return <div>folder</div>;
      case "pdf":
        return <div>pdf</div>;
      case "image":
        return <div>image</div>;
      default:
        return <div>file</div>;
    }
  };

  return (
    <div className="flex flex-col items-center p-2">
      {renderIcon()}
      <p className="mt-2 text-center text-sm break-all">{file.name}</p>
    </div>
  );
}

export default FileItem;
