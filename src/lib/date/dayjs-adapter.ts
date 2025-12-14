/**
 * Dayjs実装
 * 他のライブラリに交換する場合は、このファイルを差し替えるだけでOK
 */

import dayjs from 'dayjs';
import type { DateFormatter } from './types';

class DayjsAdapter implements DateFormatter {
  formatDate(date: Date, format: string): string {
    return dayjs(date).format(format);
  }

  parseDate(dateString: string): Date {
    return dayjs(dateString).toDate();
  }

  now(): Date {
    return dayjs().toDate();
  }

  isSame(date1: Date, date2: Date, unit: 'day' | 'month' | 'year'): boolean {
    return dayjs(date1).isSame(dayjs(date2), unit);
  }
}

export const dayjsAdapter = new DayjsAdapter();
