export const videoKeys = {
  all: ['videos'] as const,
  byDate: (date: string) => [...videoKeys.all, 'byDate', date] as const,
};
