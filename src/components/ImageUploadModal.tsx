import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import { getImageUploadCountLabel, MESSAGES } from "@/constants/messages";
import useImageUpload from "@/hooks/useImageUpload";
import { isErrorResponse } from "@/types/api";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isLoading, uploadImages } = useImageUpload();

  const handleUpload = useCallback(async () => {
    try {
      const response = await uploadImages(files, currentPath);

      if (isErrorResponse(response)) {
        setErrorMessage(response.message || MESSAGES.IMAGE_UPLOAD_ERROR);
        return;
      }

      onSuccess();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : MESSAGES.IMAGE_UPLOAD_ERROR,
      );
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

        {errorMessage && (
          <p className={`${commonStyles.error} ${styles.error}`}>
            {errorMessage}
          </p>
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
