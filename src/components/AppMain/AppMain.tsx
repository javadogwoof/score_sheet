import type { ReactNode } from 'react';
import styles from './AppMain.module.scss';

interface AppMainProps {
  children: ReactNode;
}

export const AppMain = ({ children }: AppMainProps) => {
  return <main className={styles.main}>{children}</main>;
};
