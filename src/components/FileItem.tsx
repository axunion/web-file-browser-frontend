import {
  FileHeadphone,
  FileIcon,
  FilePlay,
  FileText,
  Folder,
} from "lucide-react";
import { memo } from "react";
import { ENDPOINT_DATA } from "@/constants/config";
import { getImageAlt, getOpenFileAriaLabel } from "@/constants/messages";
import type { DirectoryItem } from "@/types/api";
import { getFileType } from "@/utils/fileType";
import { toEncodedPath } from "@/utils/path";
import styles from "./FileItem.module.css";

export type FileItemProps = {
  file: DirectoryItem;
  dirPaths: string[];
};

const icons = {
  video: <FilePlay className={styles.icon} />,
  audio: <FileHeadphone className={styles.icon} />,
  text: <FileText className={styles.icon} />,
  pdf: <FileText className={styles.icon} />,
  file: <FileIcon className={styles.icon} />,
};

const FileItem = memo(({ file, dirPaths }: FileItemProps) => {
  if (file.type === "directory") {
    return (
      <>
        <Folder className={styles.icon} />
        <div className={styles.name}>{file.name}</div>
      </>
    );
  }

  const fileType = getFileType(file.name);
  const src = `${ENDPOINT_DATA}${toEncodedPath([...dirPaths, file.name])}`;

  if (fileType === "image") {
    return (
      <>
        <img
          src={src}
          className={styles.image}
          alt={getImageAlt(file.name)}
          loading="lazy"
        />
        <div className={styles.name}>{file.name}</div>
      </>
    );
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className={styles.link}
      onClick={(e) => e.stopPropagation()}
      aria-label={getOpenFileAriaLabel(file.name)}
    >
      {icons[fileType] ?? icons.file}
      <div className={styles.name}>{file.name}</div>
    </a>
  );
});

export default FileItem;
