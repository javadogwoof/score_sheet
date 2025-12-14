/**
 * カレンダーコンポーネントのエクスポート
 * ここで使用する実装を切り替えられる
 */

import { ReactCalendarImpl } from './ReactCalendarImpl';
import type { CalendarProps } from './types';

// 使用する実装を選択（他の実装に切り替える場合はここを変更）
export const Calendar = ReactCalendarImpl;

export type { CalendarProps };
