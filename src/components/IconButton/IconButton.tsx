import styles from './IconButton.module.scss';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}

export const IconButton = ({ icon, onClick, ariaLabel }: IconButtonProps) => {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};
