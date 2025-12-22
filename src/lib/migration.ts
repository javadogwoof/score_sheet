import { getDB } from './db';

/**
 * テーブルを作成
 */
export const runMigration = async (): Promise<void> => {
  const db = getDB();

  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      videoId TEXT NOT NULL,
      date TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      videoId TEXT NOT NULL,
      contents TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (videoId) REFERENCES videos(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_videos_date ON videos(date);
    CREATE INDEX IF NOT EXISTS idx_posts_videoId ON posts(videoId);
  `;

  await db.execute(createTablesSQL, false);
  console.log('Migration completed: tables created');
};
