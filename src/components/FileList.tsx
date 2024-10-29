import { useState } from "react";
import FileItem, { type File } from "@/components/FileItem";

const data: File[] = [
  { name: "ドキュメント", type: "folder" },
  { name: "動画.mp4", type: "video" },
  { name: "音声.m4a", type: "audio" },
  { name: "写真.jpg", type: "image" },
  { name: "メモ.txt", type: "text" },
];

const FileList = () => {
  const [files] = useState<File[]>(data);

  const gridClasses =
    "grid gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10";

  return (
    <div className={gridClasses}>
      {files.map((file, index) => (
        <FileItem key={`${file.name}-${index}`} file={file} />
      ))}
    </div>
  );
};

export default FileList;
