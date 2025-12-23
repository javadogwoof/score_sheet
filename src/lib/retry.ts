import { NonRetryableError } from './errors';

/**
 * 指数バックオフでリトライを実行する
 * NonRetryableErrorの場合は即座に失敗させる（リトライしない）
 * @param fn 実行する非同期関数
 * @param maxRetries 最大リトライ回数（デフォルト: 3）
 * @param baseDelay 初回待機時間（ミリ秒、デフォルト: 300）
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 300,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // NonRetryableErrorの場合はリトライせずに即座に失敗
      if (lastError instanceof NonRetryableError) {
        throw lastError;
      }

      // 最後の試行の場合はエラーを投げる
      if (attempt === maxRetries) {
        throw lastError;
      }

      // 指数バックオフで待機（300ms、600ms、1200ms...）
      const delay = baseDelay * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // このコードには到達しないが、型安全性のため
  throw lastError || new Error('Unknown error');
}
