import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import styles from './AppHeader.module.scss';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export const AppHeader = ({
  title,
  subtitle,
  showBackButton = false,
}: AppHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
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
        <div className={styles.titleContainer}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
        </div>
      </div>
    </header>
  );
};
