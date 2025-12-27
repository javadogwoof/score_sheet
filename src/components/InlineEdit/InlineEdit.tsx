import { useEffect, useRef, useState } from 'react';
import styles from './InlineEdit.module.scss';

interface InlineEditProps {
  initialValue: string;
  onSave: (value: string) => void;
}

export const InlineEdit = ({ initialValue, onSave }: InlineEditProps) => {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // マウント時にフォーカス
    inputRef.current?.focus();
  }, []);

  const handleBlur = () => {
    onSave(value);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      className={styles.input}
    />
  );
};
