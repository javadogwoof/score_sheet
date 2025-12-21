import dayjs from 'dayjs';
import type { DateFormatter } from './types';

class DayjsAdapter implements DateFormatter {
  formatDate(date: Date, format: string): string {
    return dayjs(date).format(format);
  }
}

export const dayjsAdapter = new DayjsAdapter();
