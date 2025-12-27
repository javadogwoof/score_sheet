import { Outlet, useLocation } from 'react-router-dom';
import { AppFooter } from '@/components/AppFooter';
import styles from './Layout.module.scss';

// フッタータブを表示しないパス
const pathsWithoutFooter = ['/daily/', '/insights/'];

export const Layout = () => {
  const location = useLocation();

  const shouldShowFooter = !pathsWithoutFooter.some((path) =>
    location.pathname.startsWith(path),
  );

  return (
    <div className={styles.container}>
      <Outlet />
      {shouldShowFooter && <AppFooter />}
    </div>
  );
};
