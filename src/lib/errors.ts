/**
 * リトライ不要なエラー基底クラス
 * リソース不在、パラメータ不正など、リトライしても解決しないエラー
 */
export class NonRetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NonRetryableError';
  }
}

/**
 * リソースが見つからないエラー
 */
export class NotFoundError extends NonRetryableError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} does not exist`);
    this.name = 'NotFoundError';
  }
}

/**
 * リトライ可能なエラー基底クラス
 * データベース接続エラー、タイムアウト、一時的な障害など
 */
export class RetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetryableError';
  }
}
