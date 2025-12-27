import dayjs from 'dayjs';
import { useState } from 'react';
import { CalendarModal } from '@/components/CalendarModal';
import { Card } from '@/components/Card';
import type { Goal, GoalPriority } from '@/lib/domain/types';
import styles from './GoalEditForm.module.scss';

interface GoalEditFormProps {
  goal: Goal;
  onSave: (data: {
    title: string;
    description: string;
    priority: GoalPriority;
    deadline: string;
  }) => void;
  onCancel: () => void;
}

export const GoalEditForm = ({ goal, onSave, onCancel }: GoalEditFormProps) => {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description || '');
  const [priority, setPriority] = useState<GoalPriority>(goal.priority);
  const [deadline, setDeadline] = useState(goal.deadline);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDeadlineSelect = (date: Date) => {
    setDeadline(dayjs(date).format('YYYY-MM-DD'));
    setIsCalendarOpen(false);
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      deadline,
    });
  };

  return (
    <Card>
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            タイトル
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="目標タイトルを入力..."
            className={styles.input}
          />
        </div>

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
            onClick={onCancel}
            className={styles.cancelButton}
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={styles.saveButton}
            disabled={!title.trim()}
          >
            保存
          </button>
        </div>
      </div>

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDeadlineSelect}
        selectedDate={dayjs(deadline).toDate()}
        view="month"
      />
    </Card>
  );
};
