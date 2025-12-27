import dayjs from 'dayjs';
import { useState } from 'react';
import { Card } from '@/components/Card';
import type { GoalPriority } from '@/lib/domain/types';
import styles from './GoalForm.module.scss';

interface GoalFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialPriority?: GoalPriority;
  initialDeadline?: string;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: GoalPriority;
    deadline: string;
  }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export const GoalForm = ({
  initialTitle = '',
  initialDescription = '',
  initialPriority = 'medium',
  initialDeadline = dayjs().add(1, 'week').format('YYYY-MM-DD'),
  onSubmit,
  onCancel,
  submitLabel = '保存',
}: GoalFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [priority, setPriority] = useState<GoalPriority>(initialPriority);
  const [deadline, setDeadline] = useState(initialDeadline);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      deadline,
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>
            目標タイトル <span className={styles.required}>*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="目標を入力してください"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            詳細説明
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="目標の詳細を入力してください（任意）"
            className={styles.textarea}
            rows={4}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="priority" className={styles.label}>
            優先度 <span className={styles.required}>*</span>
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as GoalPriority)}
            className={styles.select}
            required
          >
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="deadline" className={styles.label}>
            期限 <span className={styles.required}>*</span>
          </label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.actions}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              キャンセル
            </button>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!title.trim()}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </Card>
  );
};
