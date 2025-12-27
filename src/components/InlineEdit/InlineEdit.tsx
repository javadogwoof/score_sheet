import { useState, useEffect, useRef } from 'react';
import styles from './InlineEdit.module.scss';

interface InlineEditProps {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export const InlineEdit = ({
  initialValue,
  onSave,
  onCancel,
}: InlineEditProps) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // マウント時にフォーカス
    inputRef.current?.focus();
  }, []);

  const handleBlur = () => {
    if (value.trim() && value !== initialValue) {
      onSave(value);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (value.trim() && value !== initialValue) {
        onSave(value);
      } else {
        onCancel();
      }
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={styles.input}
    />
  );
};
