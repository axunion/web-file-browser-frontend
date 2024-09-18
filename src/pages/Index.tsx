import { useState, useEffect } from "react";
import FileItem, { type File } from "../components/FileItem";

function Index() {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const data = [
      { id: 1, name: "ドキュメント", type: "folder" },
      { id: 2, name: "レポート.pdf", type: "pdf" },
      { id: 3, name: "写真.jpg", type: "image" },
      { id: 4, name: "メモ.txt", type: "text" },
    ];
    setFiles(data);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
}

export default Index;
