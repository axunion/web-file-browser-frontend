import { Icon } from "@iconify/react";
import { useCallback } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import { MESSAGES } from "@/constants/messages";
import useFileUpload from "@/hooks/useFileUpload";
import styles from "./FileUploadModal.module.css";
import commonStyles from "./ModalCommon.module.css";

export type FileUploadModalProps = {
  file: File;
  currentPath: string;
  onClose: () => void;
  onSuccess: () => void;
};

const FileUploadModal = ({
  file,
  currentPath,
  onClose,
  onSuccess,
}: FileUploadModalProps) => {
  const { isLoading, error, uploadFile } = useFileUpload();

  const handleUpload = useCallback(async () => {
    try {
      await uploadFile(file, currentPath);
      onSuccess();
    } catch {
      // useFileUpload exposes the failure through `error`.
    }
  }, [file, currentPath, onSuccess, uploadFile]);

  return (
    <Modal onClose={onClose}>
      <section>
        <div className={commonStyles.header}>
          <Icon icon="line-md:upload-loop" className={commonStyles.icon} />
          <span className={commonStyles.title}>{MESSAGES.UPLOAD}</span>
        </div>

        <p className={styles.fileName}>{file.name}</p>

        {error && (
          <p className={`${commonStyles.error} ${styles.error}`}>{error}</p>
        )}

        <button
          type="button"
          disabled={isLoading}
          aria-label={MESSAGES.UPLOAD_FILE_ARIA_LABEL}
          className={commonStyles.submitButton}
          onClick={handleUpload}
        >
          {MESSAGES.CONFIRM}
        </button>

        {isLoading && <LoadingSpinner />}
      </section>
    </Modal>
  );
};

export default FileUploadModal;
