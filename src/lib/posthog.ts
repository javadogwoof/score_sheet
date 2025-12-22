import posthog from 'posthog-js';

export const initPostHog = () => {
  const posthogKey = import.meta.env.PUBLIC_POSTHOG_KEY;
  const posthogHost = import.meta.env.PUBLIC_POSTHOG_HOST;

  if (!posthogKey) {
    console.warn('PostHog API key not found. Analytics will be disabled.');
    return;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
  });

  // グローバルエラーハンドラーを設定
  setupErrorTracking();

  console.log('PostHog initialized');
};

// エラー追跡の設定
const setupErrorTracking = () => {
  // 未キャッチのJavaScriptエラーを追跡
  window.addEventListener('error', (event) => {
    posthog.capture('$exception', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error?.stack,
    });
  });

  // 未処理のPromise拒否を追跡
  window.addEventListener('unhandledrejection', (event) => {
    posthog.capture('$exception', {
      message: `Unhandled Promise Rejection: ${event.reason}`,
      error: event.reason?.stack || String(event.reason),
    });
  });
};

// エラーを手動で報告する関数
export const reportError = (
  error: Error,
  context?: Record<string, unknown>,
) => {
  posthog.capture('$exception', {
    message: error.message,
    error: error.stack,
    ...context,
  });
};

export { posthog };
