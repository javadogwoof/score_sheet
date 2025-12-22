import { SplashScreen } from '@capacitor/splash-screen';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initDB } from '@/lib/db';
import { runMigration } from '@/lib/migration';
import './index.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// DB初期化
const initializeDatabase = async () => {
  try {
    await initDB();
    await runMigration();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  } finally {
    // DB初期化完了後（成功/失敗問わず）スプラッシュスクリーンを非表示
    await SplashScreen.hide();
  }
};

// DB初期化完了後にAppをマウント
(async () => {
  await initializeDatabase();

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
})();
