import posthog from 'posthog-js';

export const initPostHog = () => {
  const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

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
    posthog.capture('app_error', {
      error_type: event.error?.name || 'Error',
      error_message: event.message,
      error_stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      handled: false,
    });
  });

  // 未処理のPromise拒否を追跡
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const message = error?.message || String(event.reason);

    posthog.capture('app_error', {
      error_type: error?.name || 'UnhandledRejection',
      error_message: message,
      error_stack: error?.stack || String(event.reason),
      handled: false,
    });
  });
};

// エラーを手動で報告する関数
export const reportError = (
  error: Error,
  context?: Record<string, unknown>,
) => {
  posthog.capture('app_error', {
    error_type: error.name,
    error_message: error.message,
    error_stack: error.stack,
    handled: true,
    ...context,
  });
};

export { posthog };
