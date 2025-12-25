import { Modal } from '@/components/Modal';
import styles from './ConfirmDialog.module.scss';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfirm();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={styles.confirmButton}
          >
            削除
          </button>
        </div>
      </div>
    </Modal>
  );
};
