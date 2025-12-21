export interface DateFormatter {
  /**
   * DateオブジェクトをYYYY-MM-DD形式の文字列にフォーマット
   */
  formatDate(date: Date, format: string): string;
}
