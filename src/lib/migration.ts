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
      createdAt INTEGER NOT NULL,
      title TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      videoId TEXT NOT NULL,
      contents TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (videoId) REFERENCES videos(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL,
      deadline TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_videos_date ON videos(date);
    CREATE INDEX IF NOT EXISTS idx_posts_videoId ON posts(videoId);
    CREATE INDEX IF NOT EXISTS idx_goals_completed ON goals(completed);
    CREATE INDEX IF NOT EXISTS idx_goals_deadline ON goals(deadline);
  `;

  await db.execute(createTablesSQL, false);
  console.log('Migration completed: tables created');
};
