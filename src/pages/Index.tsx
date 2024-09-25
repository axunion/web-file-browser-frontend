import { useState, useEffect } from "react";
import FileItem, { type File } from "../components/FileItem";

const data = [
  { id: 1, name: "ドキュメント", type: "folder" },
  { id: 2, name: "動画.mp4", type: "video" },
  { id: 3, name: "写真.jpg", type: "image" },
  { id: 4, name: "メモ.txt", type: "text" },
];

function Index() {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setFiles(data as File[]);
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
