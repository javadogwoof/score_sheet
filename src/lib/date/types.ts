/**
 * 日付ユーティリティの抽象インターフェース
 * 実装ライブラリ（dayjs, date-fns, luxon など）を交換可能にする
 */

export interface DateFormatter {
  /**
   * DateオブジェクトをYYYY-MM-DD形式の文字列にフォーマット
   */
  formatDate(date: Date, format: string): string;

  /**
   * 文字列をDateオブジェクトにパース
   */
  parseDate(dateString: string): Date;

  /**
   * 現在の日付を取得
   */
  now(): Date;

  /**
   * 日付を比較（等しい場合はtrue）
   */
  isSame(date1: Date, date2: Date, unit: 'day' | 'month' | 'year'): boolean;
}
