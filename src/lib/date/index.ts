import { dayjsAdapter } from './dayjs-adapter';
import type { DateFormatter } from './types';

// 使用する実装を選択（他の実装に切り替える場合はここを変更）
export const dateFormatter: DateFormatter = dayjsAdapter;

// 便利なヘルパー関数
export const formatDate = (date: Date, format = 'YYYY-MM-DD'): string => {
  return dateFormatter.formatDate(date, format);
};

export type { DateFormatter } from './types';
