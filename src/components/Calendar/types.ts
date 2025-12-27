/**
 * カレンダーコンポーネントの抽象インターフェース
 * 実装ライブラリ（react-calendar, react-day-picker など）を交換可能にする
 */

export interface CalendarProps {
  /**
   * 日付が選択されたときのコールバック
   */
  onDateSelect: (date: Date) => void;

  /**
   * カスタムクラス名
   */
  className?: string;

  /**
   * ロケール（デフォルト: ja-JP）
   */
  locale?: string;

  /**
   * 現在の月を外部から制御
   */
  value?: Date;

  /**
   * カレンダーの表示月が変更されたときのコールバック
   */
  onActiveStartDateChange?: (date: Date) => void;

  /**
   * 表示モード（月: 日付選択、年: 月選択、10年: 年選択）
   */
  view?: 'month' | 'year' | 'decade';
}
