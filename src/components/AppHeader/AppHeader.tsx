import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.scss';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  actionButton?: React.ReactNode;
}

export const AppHeader = ({
  title,
  subtitle,
  showBackButton = false,
  actionButton,
}: AppHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.left}>
          {showBackButton && (
            <button
              type="button"
              className={styles.backButton}
              onClick={handleBack}
              aria-label="戻る"
            >
              <IoArrowBack />
            </button>
          )}
        </div>
        <div className={styles.center}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
        </div>
        <div className={styles.right}>{actionButton}</div>
      </div>
    </header>
  );
};
