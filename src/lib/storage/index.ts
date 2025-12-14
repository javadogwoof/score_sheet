/**
 * ストレージのエクスポート
 * ここで使用する実装を切り替えられる
 */

import { mockStorageAdapter } from './mock-adapter';
// import { sqliteStorageAdapter } from './sqlite-adapter';
import type { StorageAdapter } from './types';

// 使用する実装を選択（環境変数などで切り替えることも可能）
export const storage: StorageAdapter = mockStorageAdapter;
// 将来的にSQLiteに切り替える場合：
// export const storage: StorageAdapter = sqliteStorageAdapter;

// 初期化関数
export const initializeStorage = async () => {
  await storage.initialize();
};

export type { StorageAdapter, Video, Memo, Retrospective } from './types';
