/**
 * ドメインエラー基底クラス（リトライ不要）
 * ビジネスロジックやドメイン制約の違反を示す
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

/**
 * リソースが見つからないエラー
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} does not exist`);
    this.name = 'NotFoundError';
  }
}

/**
 * データベースアクセスエラー（リトライ可能）
 * 接続エラー、タイムアウト、一時的な障害など
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
