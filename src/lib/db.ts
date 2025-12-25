import {
  CapacitorSQLite,
  SQLiteConnection,
  type SQLiteDBConnection,
} from '@capacitor-community/sqlite';

let db: SQLiteDBConnection | null = null;
let sqlite: SQLiteConnection | null = null;

const DB_NAME = 'score_sheet.db';

/**
 * SQLiteデータベースを初期化してコネクションを確立
 */
export const initDB = async (): Promise<void> => {
  try {
    sqlite = new SQLiteConnection(CapacitorSQLite);

    // データベースを開く
    db = await sqlite.createConnection(
      DB_NAME,
      false,
      'no-encryption',
      1,
      false,
    );

    await db.open();

    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

/**
 * データベースを閉じる
 */
export const closeDB = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
  }
};

/**
 * コネクションが有効かチェックして、必要に応じて再接続
 */
export const ensureConnection = async (): Promise<void> => {
  try {
    if (!db) {
      await initDB();
      return;
    }

    // コネクションが開いているかチェック
    const isOpen = await db.isDBOpen();
    if (!isOpen.result) {
      await db.open();
    }
  } catch (_error) {
    // エラーの場合は完全に再初期化
    db = null;
    await initDB();
  }
};

/**
 * データベース接続を取得
 */
export const getDB = (): SQLiteDBConnection => {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
};
