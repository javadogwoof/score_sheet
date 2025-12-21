/**
 * ストレージのエクスポート
 * ここで使用する実装を切り替えられる
 */

import { Capacitor } from '@capacitor/core';
import { mockStorageAdapter } from './mock-adapter';
import { sqliteStorageAdapter } from './sqlite-adapter';
import type { StorageAdapter } from './types';

// 使用する実装を選択（環境変数などで切り替えることも可能）
// export const storage: StorageAdapter = mockStorageAdapter;
// 将来的にSQLiteに切り替える場合：
export const storage: StorageAdapter =
  Capacitor.getPlatform() === 'web' ? mockStorageAdapter : sqliteStorageAdapter;

// 初期化関数
export const initializeStorage = async () => {
  await storage.initialize();
};

export type {
  Memo,
  Retrospective,
  StorageAdapter,
  YoutubeVideoIdDTO,
} from './types';
