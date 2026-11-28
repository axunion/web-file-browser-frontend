import { useCallback, useState } from "react";
import FileUploadButton from "@/components/FileUploadButton";
import FileUploadModal from "@/components/FileUploadModal";
import MultiFileUploadModal from "@/components/MultiFileUploadModal";
import { TRASH_FOLDER_NAME } from "@/constants/config";
import { MESSAGES } from "@/constants/messages";
import type { ToastType } from "@/hooks/useToast";
import { getParentPaths, setPaths } from "@/utils/path";
import BackButton from "./BackButton";
import styles from "./Header.module.css";

type Upload = { mode: "single" | "multi"; files: File[] };

export type HeaderProps = {
  title?: string;
  paths: string[];
  onFileListUpdate: () => void;
  showToast: (type: ToastType, message: string) => void;
};

const Header = ({ title, paths, onFileListUpdate, showToast }: HeaderProps) => {
  const currentPath = paths.join("/");
  const isTrashFolder = paths.length === 1 && paths[0] === TRASH_FOLDER_NAME;
  const [upload, setUpload] = useState<Upload | null>(null);

  const onFilesSelected = useCallback((files: File[]): void => {
    if (files.length === 0) {
      return;
    }

    setUpload({ mode: files.length === 1 ? "single" : "multi", files });
  }, []);

  const onClosed = useCallback(() => {
    setUpload(null);
  }, []);

  const handleBack = useCallback(() => {
    setPaths(getParentPaths(paths));
  }, [paths]);

  const handleUploadSuccess = useCallback(() => {
    setUpload(null);
    onFileListUpdate();
  }, [onFileListUpdate]);

  return (
    <>
      <header className={styles.header}>
        <span className={styles.slot}>
          {title && !isTrashFolder && <BackButton onBack={handleBack} />}
        </span>

        <h1 className={styles.title}>
          <span>{title ?? MESSAGES.APP_TITLE}</span>
        </h1>

        <span className={styles.slot}>
          {!isTrashFolder && (
            <FileUploadButton onFilesSelected={onFilesSelected} />
          )}
        </span>
      </header>

      {upload?.mode === "single" && (
        <FileUploadModal
          file={upload.files[0]}
          currentPath={currentPath}
          onClose={onClosed}
          onSuccess={handleUploadSuccess}
        />
      )}

      {upload?.mode === "multi" && (
        <MultiFileUploadModal
          files={upload.files}
          currentPath={currentPath}
          onClose={onClosed}
          onSuccess={handleUploadSuccess}
          onFileListUpdate={onFileListUpdate}
          showToast={showToast}
        />
      )}
    </>
  );
};

export default Header;
