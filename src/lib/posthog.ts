import posthog from 'posthog-js';

export const initPostHog = () => {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST;

  if (!posthogKey) {
    console.warn('PostHog API key not found. Analytics will be disabled.');
    return;
  }

  posthog.init(posthogKey, {
    api_host: posthogHost || 'https://app.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
  });

  console.log('PostHog initialized');
};

export { posthog };
