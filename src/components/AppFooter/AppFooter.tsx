import { IoFlag, IoHome, IoPlay, IoStatsChart } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AppFooter.module.scss';

interface Tab {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const tabs: Tab[] = [
  { path: '/', icon: <IoHome />, label: 'ホーム' },
  { path: '/videos', icon: <IoPlay />, label: '動画' },
  { path: '/analysis', icon: <IoStatsChart />, label: '自己分析' },
  { path: '/goals', icon: <IoFlag />, label: '目標設定' },
];

export const AppFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <footer className={styles.footer}>
      <nav className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.path}
            type="button"
            className={`${styles.tab} ${location.pathname === tab.path ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.path)}
          >
            <div className={styles.icon}>{tab.icon}</div>
            <span className={styles.label}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};
