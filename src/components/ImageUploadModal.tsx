import { Icon } from "@iconify/react";
import { useCallback } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import { getImageUploadCountLabel, MESSAGES } from "@/constants/messages";
import useImageUpload from "@/hooks/useImageUpload";
import styles from "./FileUploadModal.module.css";
import commonStyles from "./ModalCommon.module.css";

export type ImageUploadModalProps = {
  files: File[];
  currentPath: string;
  onClose: () => void;
  onSuccess: () => void;
};

const ImageUploadModal = ({
  files,
  currentPath,
  onClose,
  onSuccess,
}: ImageUploadModalProps) => {
  const { isLoading, error, uploadImages } = useImageUpload();

  const handleUpload = useCallback(async () => {
    try {
      await uploadImages(files, currentPath);
      onSuccess();
    } catch {
      // useImageUpload exposes the failure through `error`.
    }
  }, [files, currentPath, onSuccess, uploadImages]);

  return (
    <Modal onClose={onClose}>
      <section>
        <div className={commonStyles.header}>
          <Icon icon="line-md:upload-loop" className={commonStyles.icon} />
          <span className={commonStyles.title}>{MESSAGES.UPLOAD_IMAGES}</span>
        </div>

        <p className={styles.fileName}>
          {getImageUploadCountLabel(files.length)}
        </p>

        {error && (
          <p className={`${commonStyles.error} ${styles.error}`}>{error}</p>
        )}

        <button
          type="button"
          disabled={isLoading}
          aria-label={MESSAGES.UPLOAD_IMAGES_ARIA_LABEL}
          className={`${commonStyles.submitButton} ${styles.submitButton}`}
          onClick={handleUpload}
        >
          {MESSAGES.CONFIRM}
        </button>

        {isLoading && <LoadingSpinner />}
      </section>
    </Modal>
  );
};

export default ImageUploadModal;
