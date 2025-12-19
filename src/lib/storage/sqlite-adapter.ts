/**
 * SQLite実装
 * @capacitor-community/sqliteを使用
 */

import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import type { StorageAdapter, Retrospective, Memo, Video } from './types';

const DB_NAME = 'scoresheet.db';
const DB_VERSION = 1;

class SQLiteStorageAdapter implements StorageAdapter {
  private sqliteConnection: SQLiteConnection | null = null;
  private db: SQLiteDBConnection | null = null;

  async initialize(): Promise<void> {
    try {
      // SQLite接続の初期化
      this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);

      // Webの場合は jeep-sqlite をロード
      if (Capacitor.getPlatform() === 'web') {
        await this.initializeWeb();
      }

      // データベースを開く
      this.db = await this.sqliteConnection.createConnection(
        DB_NAME,
        false,
        'no-encryption',
        DB_VERSION,
        false
      );

      await this.db.open();

      // テーブルを作成
      await this.createTables();

      console.log('SQLite initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SQLite:', error);
      throw error;
    }
  }

  private async initializeWeb(): Promise<void> {
    if (!this.sqliteConnection) return;

    const jeepSqlite = document.createElement('jeep-sqlite');
    document.body.appendChild(jeepSqlite);
    await customElements.whenDefined('jeep-sqlite');

    await this.sqliteConnection.initWebStore();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        source TEXT NOT NULL,
        title TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id INTEGER,
        date TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS retrospective_videos (
        date TEXT NOT NULL,
        video_id INTEGER NOT NULL,
        PRIMARY KEY (date, video_id),
        FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_memos_date ON memos(date);
      CREATE INDEX IF NOT EXISTS idx_retrospective_videos_date ON retrospective_videos(date);
    `;

    await this.db.execute(createTablesSQL);
  }

  async getRetrospective(date: string): Promise<Retrospective | null> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const videos = await this.getVideosByDate(date);
      const memos = await this.getMemosByDate(date);

      if (videos.length === 0 && memos.length === 0) {
        return null;
      }

      return {
        date,
        videos,
        memos,
      };
    } catch (error) {
      console.error('Failed to get retrospective:', error);
      throw error;
    }
  }

  async saveRetrospective(retrospective: Retrospective): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // 動画を保存
      for (const video of retrospective.videos) {
        const videoId = await this.saveVideo(video);

        // retrospective_videosテーブルに関連付けを保存
        await this.db.run(
          'INSERT OR IGNORE INTO retrospective_videos (date, video_id) VALUES (?, ?)',
          [retrospective.date, videoId]
        );
      }

      // メモを保存
      for (const memo of retrospective.memos) {
        await this.saveMemo({ ...memo, date: retrospective.date });
      }
    } catch (error) {
      console.error('Failed to save retrospective:', error);
      throw error;
    }
  }

  async saveMemo(memo: Memo): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      if (memo.id) {
        // 更新
        await this.db.run(
          `UPDATE memos
           SET content = ?, video_id = ?, timestamp = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [memo.content, memo.video_id || null, memo.timestamp || null, memo.id]
        );
      } else {
        // 新規作成
        await this.db.run(
          `INSERT INTO memos (date, content, video_id, timestamp)
           VALUES (?, ?, ?, ?)`,
          [memo.date, memo.content, memo.video_id || null, memo.timestamp || null]
        );
      }
    } catch (error) {
      console.error('Failed to save memo:', error);
      throw error;
    }
  }

  async saveVideo(video: Video): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      if (video.id) {
        // 更新
        await this.db.run(
          `UPDATE videos
           SET type = ?, source = ?, title = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [video.type, video.source, video.title || null, video.id]
        );
        return video.id;
      } else {
        // 新規作成
        const result = await this.db.run(
          `INSERT INTO videos (type, source, title)
           VALUES (?, ?, ?)`,
          [video.type, video.source, video.title || null]
        );

        return result.changes?.lastId || 0;
      }
    } catch (error) {
      console.error('Failed to save video:', error);
      throw error;
    }
  }

  async getVideosByDate(date: string): Promise<Video[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.query(
        `SELECT v.* FROM videos v
         INNER JOIN retrospective_videos rv ON v.id = rv.video_id
         WHERE rv.date = ?
         ORDER BY v.created_at DESC`,
        [date]
      );

      return (result.values || []).map((row) => ({
        id: row.id,
        type: row.type,
        source: row.source,
        title: row.title,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    } catch (error) {
      console.error('Failed to get videos by date:', error);
      throw error;
    }
  }

  async getMemosByDate(date: string): Promise<Memo[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const result = await this.db.query(
        `SELECT * FROM memos
         WHERE date = ?
         ORDER BY created_at DESC`,
        [date]
      );

      return (result.values || []).map((row) => ({
        id: row.id,
        video_id: row.video_id,
        date: row.date,
        content: row.content,
        timestamp: row.timestamp,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));
    } catch (error) {
      console.error('Failed to get memos by date:', error);
      throw error;
    }
  }

  async deletePost(date: string, videoId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // retrospective_videosから削除（これにより動画との関連が削除される）
      await this.db.run(
        'DELETE FROM retrospective_videos WHERE date = ? AND video_id = ?',
        [date, videoId]
      );

      // 動画に紐づくメモを削除
      await this.db.run(
        'DELETE FROM memos WHERE date = ? AND video_id = ?',
        [date, videoId]
      );

      // 他の日付で参照されていない動画は削除
      const result = await this.db.query(
        'SELECT COUNT(*) as count FROM retrospective_videos WHERE video_id = ?',
        [videoId]
      );

      if (result.values && result.values[0].count === 0) {
        await this.db.run('DELETE FROM videos WHERE id = ?', [videoId]);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  }
}

export const sqliteStorageAdapter = new SQLiteStorageAdapter();
