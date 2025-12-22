import { useEffect } from 'react';
import { posthog } from '@/lib/posthog';

export const usePostHog = () => {
  return {
    capture: (eventName: string, properties?: Record<string, unknown>) => {
      posthog.capture(eventName, properties);
    },
    identify: (userId: string, properties?: Record<string, unknown>) => {
      posthog.identify(userId, properties);
    },
    reset: () => {
      posthog.reset();
    },
  };
};

// ページビューを自動追跡するフック
export const usePageView = (pageName: string) => {
  useEffect(() => {
    posthog.capture('$pageview', { page: pageName });
  }, [pageName]);
};
