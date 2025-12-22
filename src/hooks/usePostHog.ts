import { useCallback, useEffect } from 'react';
import { posthog, reportError as reportErrorToPostHog } from '@/lib/posthog';

export const usePostHog = () => {
  const capture = useCallback(
    (eventName: string, properties?: Record<string, unknown>) => {
      posthog.capture(eventName, properties);
    },
    [],
  );

  const identify = useCallback(
    (userId: string, properties?: Record<string, unknown>) => {
      posthog.identify(userId, properties);
    },
    [],
  );

  const reset = useCallback(() => {
    posthog.reset();
  }, []);

  const reportError = useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      reportErrorToPostHog(error, context);
    },
    [],
  );

  return {
    capture,
    identify,
    reset,
    reportError,
  };
};

// ページビューを自動追跡するフック
export const usePageView = (pageName: string) => {
  useEffect(() => {
    posthog.capture('$pageview', { page: pageName });
  }, [pageName]);
};
