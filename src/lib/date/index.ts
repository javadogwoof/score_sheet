/**
 * 日付ユーティリティのエクスポート
 * ここで使用する実装を切り替えられる
 */

import { dayjsAdapter } from './dayjs-adapter';
import type { DateFormatter } from './types';

// 使用する実装を選択（他の実装に切り替える場合はここを変更）
export const dateFormatter: DateFormatter = dayjsAdapter;

// 便利なヘルパー関数
export const formatDate = (date: Date, format = 'YYYY-MM-DD'): string => {
  return dateFormatter.formatDate(date, format);
};

export const parseDate = (dateString: string): Date => {
  return dateFormatter.parseDate(dateString);
};

export const now = (): Date => {
  return dateFormatter.now();
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return dateFormatter.isSame(date1, date2, 'day');
};

export type { DateFormatter } from './types';
