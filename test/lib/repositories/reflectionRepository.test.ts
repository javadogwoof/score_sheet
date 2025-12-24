import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SQLiteDBConnection } from '@capacitor-community/sqlite';
import {
  updateReflection,
  deleteReflection,
  postVideo,
} from '@/lib/repositories/reflectionRepository';
import { NotFoundError, RetryableError } from '@/lib/errors';
import * as db from '@/lib/db';

// getDBをモック
vi.mock('@/lib/db', () => ({
  getDB: vi.fn(),
}));

describe('reflectionRepository', () => {
  let mockDB: Partial<SQLiteDBConnection>;

  beforeEach(() => {
    vi.clearAllMocks();

    // モックDBを作成
    mockDB = {
      run: vi.fn(),
      query: vi.fn(),
      beginTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      rollbackTransaction: vi.fn(),
    };

    vi.mocked(db.getDB).mockReturnValue(mockDB as SQLiteDBConnection);
  });

  describe('updateReflection', () => {
    it('正常に更新された場合、エラーをthrowしない', async () => {
      vi.mocked(mockDB.run).mockResolvedValue({
        changes: { changes: 1 },
      });

      await expect(
        updateReflection('post-id', 'updated content'),
      ).resolves.toBeUndefined();

      expect(mockDB.run).toHaveBeenCalled();
    });

    it('投稿が存在しない場合、NotFoundErrorをthrowする', async () => {
      // リトライが成功するが、changes=0
      vi.mocked(mockDB.run).mockResolvedValue({
        changes: { changes: 0 },
      });

      await expect(
        updateReflection('non-existent-id', 'content'),
      ).rejects.toThrow(NotFoundError);

      await expect(
        updateReflection('non-existent-id', 'content'),
      ).rejects.toThrow('Post with id non-existent-id does not exist');
    });

    it('DB操作が失敗した場合、リトライしてからRetryableErrorをthrowする', async () => {
      const dbError = new Error('Database connection failed');
      vi.mocked(mockDB.run).mockRejectedValue(dbError);

      await expect(updateReflection('post-id', 'content')).rejects.toThrow(
        RetryableError,
      );

      // リトライされることを確認（初回 + 3回リトライ = 4回）
      expect(mockDB.run).toHaveBeenCalledTimes(4);
    });
  });

  describe('deleteReflection', () => {
    it('正常に削除された場合、エラーをthrowしない', async () => {
      vi.mocked(mockDB.run).mockResolvedValue({
        changes: { changes: 1 },
      });

      await expect(deleteReflection('post-id')).resolves.toBeUndefined();

      expect(mockDB.run).toHaveBeenCalled();
    });

    it('投稿が存在しない場合、NotFoundErrorをthrowする', async () => {
      vi.mocked(mockDB.run).mockResolvedValue({
        changes: { changes: 0 },
      });

      await expect(deleteReflection('non-existent-id')).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('createVideoWithReflection', () => {
    it('正常に作成された場合、videoIdとpostIdを返す', async () => {
      vi.mocked(mockDB.run).mockResolvedValue({
        changes: { changes: 1 },
      });
      vi.mocked(mockDB.beginTransaction).mockResolvedValue();
      vi.mocked(mockDB.commitTransaction).mockResolvedValue({
        changes: { changes: 0 },
      });

      const result = await postVideo(
        'video-id',
        'youtube-id',
        '2025-01-01',
        'initial content',
      );

      expect(result).toHaveProperty('videoId', 'video-id');
      expect(result).toHaveProperty('postId');
      expect(mockDB.beginTransaction).toHaveBeenCalled();
      expect(mockDB.commitTransaction).toHaveBeenCalled();
    });

    it('トランザクション中にエラーが発生した場合、ロールバックしてRetryableErrorをthrowする', async () => {
      const dbError = new Error('Insert failed');
      vi.mocked(mockDB.beginTransaction).mockResolvedValue();
      vi.mocked(mockDB.run).mockRejectedValue(dbError);
      vi.mocked(mockDB.rollbackTransaction).mockResolvedValue({
        changes: { changes: 0 },
      });

      await expect(
        postVideo(
          'video-id',
          'youtube-id',
          '2025-01-01',
          'content',
        ),
      ).rejects.toThrow(RetryableError);

      // リトライされることを確認
      expect(mockDB.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
