import {
  CircleCheck,
  CircleMinus,
  CircleX,
  LoaderCircle,
  type LucideIcon,
  Upload,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import {
  getMultiFileUploadCountLabel,
  getMultiFileUploadProgressLabel,
  MESSAGES,
} from "@/constants/messages";
import useMultiFileUpload, {
  type FileUploadStatus,
} from "@/hooks/useMultiFileUpload";
import type { ToastType } from "@/hooks/useToast";
import commonStyles from "./ModalCommon.module.css";
import styles from "./MultiFileUploadModal.module.css";

const STATUS_ICON: Record<FileUploadStatus, LucideIcon> = {
  pending: CircleMinus,
  uploading: LoaderCircle,
  success: CircleCheck,
  error: CircleX,
};

const STATUS_STYLE: Record<FileUploadStatus, string> = {
  pending: styles.statusPending,
  uploading: `${styles.statusUploading} spin`,
  success: styles.statusSuccess,
  error: styles.statusError,
};

export type MultiFileUploadModalProps = {
  files: File[];
  currentPath: string;
  onClose: () => void;
  onSuccess: () => void;
  onFileListUpdate: () => void;
  showToast: (type: ToastType, message: string) => void;
};

const MultiFileUploadModal = ({
  files,
  currentPath,
  onClose,
  onSuccess,
  onFileListUpdate,
  showToast,
}: MultiFileUploadModalProps) => {
  // Unmounting the modal aborts any in-flight upload inside the hook.
  const { isUploading, statuses, uploadFiles } = useMultiFileUpload();

  const handleUpload = async () => {
    const result = await uploadFiles(files, currentPath, statuses);
    if (!result) return;

    if (result.every((status) => status === "success")) {
      showToast("success", MESSAGES.MULTI_FILE_UPLOAD_SUCCESS);
      onSuccess();
    } else {
      showToast("warning", MESSAGES.MULTI_FILE_UPLOAD_PARTIAL_ERROR);
      onFileListUpdate();
    }
  };

  // Closing aborts the run, but files that finished before that are already on
  // the server. The one in flight may still land after this refresh.
  const handleClose = () => {
    if (isUploading) {
      onFileListUpdate();
    }
    onClose();
  };

  const completedCount = statuses.filter(
    (status) => status === "success" || status === "error",
  ).length;

  const showProgress =
    isUploading || statuses.some((status) => status !== "pending");

  return (
    <Modal onClose={handleClose}>
      <section>
        <div className={commonStyles.header}>
          <Upload className={commonStyles.icon} />
          <span className={commonStyles.title}>{MESSAGES.UPLOAD_FILES}</span>
        </div>

        <div className={styles.fileList} aria-busy={isUploading}>
          {files.map((file, index) => {
            const status = statuses[index] ?? "pending";
            const StatusIcon = STATUS_ICON[status];
            return (
              <div key={file.name} className={styles.fileItem}>
                <StatusIcon
                  className={`${styles.statusIcon} ${STATUS_STYLE[status]}`}
                />
                <span className={styles.fileName}>{file.name}</span>
              </div>
            );
          })}
        </div>

        <p className={styles.progress}>
          {showProgress
            ? getMultiFileUploadProgressLabel(completedCount, files.length)
            : getMultiFileUploadCountLabel(files.length)}
        </p>

        <button
          type="button"
          disabled={isUploading}
          aria-label={MESSAGES.UPLOAD_FILES_ARIA_LABEL}
          className={commonStyles.submitButton}
          onClick={handleUpload}
        >
          {MESSAGES.CONFIRM}
        </button>

        {isUploading && <LoadingSpinner />}
      </section>
    </Modal>
  );
};

export default MultiFileUploadModal;
