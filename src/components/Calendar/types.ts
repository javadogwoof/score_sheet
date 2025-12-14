/**
 * カレンダーコンポーネントの抽象インターフェース
 * 実装ライブラリ（react-calendar, react-day-picker など）を交換可能にする
 */

export interface CalendarProps {
  /**
   * 選択された日付
   */
  value?: Date;

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
}
