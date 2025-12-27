export const videoKeys = {
  all: ['videos'] as const,
  byDate: (date: string) => [...videoKeys.all, 'byDate', date] as const,
  byId: (videoId: string) => [...videoKeys.all, 'byId', videoId] as const,
  allPosts: () => [...videoKeys.all, 'allPosts'] as const,
  postsByMonth: (yearMonth: string) =>
    [...videoKeys.all, 'postsByMonth', yearMonth] as const,
};

export const goalKeys = {
  all: ['goals'] as const,
};
