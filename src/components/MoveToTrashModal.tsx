import { Icon } from "@iconify/react";
import Modal from "@/components/Modal";
import { MESSAGES } from "@/constants/messages";
import useDelete from "@/hooks/useDelete";
import type { DirectoryItem } from "@/types/api";
import commonStyles from "./ModalCommon.module.css";
import styles from "./MoveToTrashModal.module.css";

export type MoveToTrashModalProps = {
  item: DirectoryItem;
  currentPath: string;
  onClose: () => void;
  onSuccess: () => void;
};

const MoveToTrashModal = ({
  item,
  currentPath,
  onClose,
  onSuccess,
}: MoveToTrashModalProps) => {
  const { deleteFile, isLoading, error } = useDelete();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await deleteFile({ path: currentPath, name: item.name });
      onSuccess();
    } catch {
      // useDelete exposes the failure through `error`.
    }
  };

  return (
    <Modal onClose={onClose}>
      <section>
        <div className={commonStyles.header}>
          <Icon icon="line-md:trash" className={commonStyles.icon} />
          <span className={commonStyles.title}>{MESSAGES.DELETE}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            <p>{MESSAGES.CONFIRM_DELETE}</p>
            {error && (
              <p className={`${commonStyles.error} ${styles.error}`}>{error}</p>
            )}
          </div>

          <div className={commonStyles.actions}>
            <button
              type="submit"
              disabled={isLoading}
              className={`${commonStyles.submitButton} ${styles.submitButton}`}
            >
              {MESSAGES.CONFIRM}
            </button>
          </div>
        </form>
      </section>
    </Modal>
  );
};

export default MoveToTrashModal;
