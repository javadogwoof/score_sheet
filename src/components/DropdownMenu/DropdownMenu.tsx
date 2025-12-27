import { useEffect, useRef, useState } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { IconButton } from '@/components/IconButton';
import styles from './DropdownMenu.module.scss';

export interface MenuItem {
  label: string;
  onClick: () => void;
}

interface DropdownMenuProps {
  items: MenuItem[];
  ariaLabel?: string;
}

export const DropdownMenu = ({
  items,
  ariaLabel = 'メニュー',
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // メニュー外をクリックしたら閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className={styles.container}>
      <IconButton
        icon={<IoEllipsisVertical />}
        onClick={() => setIsOpen(!isOpen)}
        ariaLabel={ariaLabel}
      />
      {isOpen && (
        <div className={styles.menu}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleItemClick(item.onClick)}
              className={styles.menuItem}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
