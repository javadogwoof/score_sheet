/**
 * SQLite実装（プレースホルダー）
 * 後で実装する
 */

import type { StorageAdapter, Retrospective, Memo, Video } from './types';

class SQLiteStorageAdapter implements StorageAdapter {
  async initialize(): Promise<void> {
    // TODO: SQLiteの初期化
    // - データベース接続
    // - テーブル作成
    throw new Error('SQLite adapter not implemented yet');
  }

  async getRetrospective(date: string): Promise<Retrospective | null> {
    // TODO: SQLiteからデータ取得
    throw new Error(date+ 'SQLite adapter not implemented yet');
  }

  async saveRetrospective(retrospective: Retrospective): Promise<void> {
    // TODO: SQLiteにデータ保存
    throw new Error(retrospective.date + 'SQLite adapter not implemented yet');
  }

  async saveMemo(memo: Memo): Promise<void> {
    // TODO: SQLiteにメモ保存
    throw new Error(memo.date + 'SQLite adapter not implemented yet');
  }

  async saveVideo(video: Video): Promise<number> {
    // TODO: SQLiteに動画保存
    throw new Error(video.title + 'SQLite adapter not implemented yet');
  }

  async getVideosByDate(date: string): Promise<Video[]> {
    // TODO: SQLiteから動画取得
    throw new Error(date + 'SQLite adapter not implemented yet');
  }

  async getMemosByDate(date: string): Promise<Memo[]> {
    // TODO: SQLiteからメモ取得
    throw new Error(date + 'SQLite adapter not implemented yet');
  }
}

export const sqliteStorageAdapter = new SQLiteStorageAdapter();
