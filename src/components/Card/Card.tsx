import type { CardProps } from '@/components/Card/types.ts';
import styles from './Card.module.scss';

export const Card = ({ children, onClick, className }: CardProps) => {
  const combinedClassName = className
    ? `${styles.container} ${className}`
    : styles.container;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={combinedClassName}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};
