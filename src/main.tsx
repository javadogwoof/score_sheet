import { App as CapacitorApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ensureConnection, initDB } from '@/lib/db';
import { runMigration } from '@/lib/migration';
import { initPostHog, reportError } from '@/lib/posthog';
import './index.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// TanStack Query設定
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分間はキャッシュを使用
      retry: false, // Repository層でリトライ済み
      refetchOnWindowFocus: false, // ローカルDBなので不要
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// DB初期化・接続確認（起動時とバックグラウンド復帰時に共通で使用）
const ensureDatabaseReady = async (isInitialSetup = false) => {
  if (isInitialSetup) {
    // 初回起動時は新規接続
    await initDB();
  } else {
    // バックグラウンド復帰時は接続確認・再接続
    await ensureConnection();
  }

  // マイグレーションを実行
  await runMigration();
};

// DB初期化（起動時のみ）
const initializeDatabase = async () => {
  try {
    await ensureDatabaseReady(true);
  } finally {
    // DB初期化完了後（成功/失敗問わず）スプラッシュスクリーンを非表示
    await SplashScreen.hide();
  }
};

// アプリのライフサイクルを監視（バックグラウンド復帰時のDB接続確認）
const setupAppLifecycle = () => {
  CapacitorApp.addListener('appStateChange', async (state) => {
    if (state.isActive) {
      try {
        await ensureDatabaseReady(false);
      } catch (error) {
        console.error('Failed to restore database connection:', error);
        // PostHogにエラーを報告
        if (error instanceof Error) {
          reportError(error, {
            context: 'backgroundResume',
            timestamp: Date.now(),
          });
        }
      }
    }
  });
};

// 初期化してからAppをマウント
(async () => {
  // PostHogを初期化（分析ツール）
  initPostHog();

  // DBを初期化
  await initializeDatabase();

  // ライフサイクル監視をセットアップ
  setupAppLifecycle();

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
})();
