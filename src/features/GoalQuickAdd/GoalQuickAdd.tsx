import dayjs from 'dayjs';
import { useState } from 'react';
import { IoAdd, IoCheckmark, IoClose } from 'react-icons/io5';
import { Card } from '@/components/Card/Card';
import { CalendarModal } from '@/components/CalendarModal';
import type { GoalPriority } from '@/lib/domain/types';
import styles from './GoalQuickAdd.module.scss';

interface GoalQuickAddProps {
  onAdd: (data: {
    title: string;
    description: string;
    priority: GoalPriority;
    deadline: string;
  }) => void;
}

type Mode = 'collapsed' | 'title' | 'details';

export const GoalQuickAdd = ({ onAdd }: GoalQuickAddProps) => {
  const [mode, setMode] = useState<Mode>('collapsed');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<GoalPriority>('medium');
  const [deadline, setDeadline] = useState(
    dayjs().add(1, 'week').format('YYYY-MM-DD'),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleStartAdd = () => {
    setMode('title');
  };

  const handleConfirmTitle = () => {
    if (title.trim()) {
      setMode('details');
    }
  };

  const handleCancel = () => {
    setMode('collapsed');
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDeadline(dayjs().add(1, 'week').format('YYYY-MM-DD'));
    setIsCalendarOpen(false);
  };

  const handleDeadlineSelect = (date: Date) => {
    setDeadline(dayjs(date).format('YYYY-MM-DD'));
    setIsCalendarOpen(false);
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      deadline,
    });

    // リセット
    handleCancel();
  };

  if (mode === 'collapsed') {
    return (
      <div className={styles.floatingContainer}>
        <button
          type="button"
          onClick={handleStartAdd}
          className={styles.addButton}
          aria-label="目標を追加"
        >
          <IoAdd className={styles.icon} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.floatingContainer}>
      <Card className={styles.card}>
      {/* タイトル入力 */}
      <div className={styles.titleSection}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="目標タイトルを入力..."
          className={styles.titleInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && title.trim()) {
              handleConfirmTitle();
            }
          }}
        />
        {mode === 'title' && (
          <div className={styles.titleActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.iconButton}
              aria-label="キャンセル"
            >
              <IoClose />
            </button>
            <button
              type="button"
              onClick={handleConfirmTitle}
              className={styles.iconButton}
              disabled={!title.trim()}
              aria-label="詳細設定へ"
            >
              <IoCheckmark />
            </button>
          </div>
        )}
      </div>

      {/* 詳細設定（展開後） */}
      {mode === 'details' && (
        <div className={styles.detailsSection}>
          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              詳細説明（任意）
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="詳細を入力..."
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="priority" className={styles.label}>
                優先度
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as GoalPriority)}
                className={styles.select}
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="deadline" className={styles.label}>
                期限
              </label>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className={styles.dateButton}
              >
                {dayjs(deadline).format('YYYY年M月D日')}
              </button>
            </div>
          </div>

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
              onClick={handleSave}
              className={styles.saveButton}
            >
              保存
            </button>
          </div>
        </div>
      )}

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDeadlineSelect}
        selectedDate={dayjs(deadline).toDate()}
        view="month"
      />
      </Card>
    </div>
  );
};
