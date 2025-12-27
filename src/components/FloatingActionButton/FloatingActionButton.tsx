import styles from './FloatingActionButton.module.scss';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}

export const FloatingActionButton = ({
  icon,
  onClick,
  ariaLabel,
}: FloatingActionButtonProps) => {
  return (
    <button
      type="button"
      className={styles.fab}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};
