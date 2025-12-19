/**
 * モック実装（開発用）
 * 実際のストレージの代わりにメモリ上でデータを管理
 */

import type { StorageAdapter, Retrospective, Memo, Video } from './types';

class MockStorageAdapter implements StorageAdapter {
  private data: Map<string, Retrospective> = new Map();

  async initialize(): Promise<void> {
    // モックデータの初期化
    this.data.set('2025-12-14', {
      date: '2025-12-14',
      videos: [
        {
          id: 1,
          type: 'youtube',
          source: 'FO6P4FoLRPU',
          title: 'サンプル動画',
        },
      ],
      memos: [
        {
          id: 1,
          video_id: 1,
          date: '2025-12-14',
          content: 'サンプルメモ',
        },
      ],
    });
  }

  async getRetrospective(date: string): Promise<Retrospective | null> {
    return this.data.get(date) || null;
  }

  async saveRetrospective(retrospective: Retrospective): Promise<void> {
    this.data.set(retrospective.date, retrospective);
  }

  async saveMemo(memo: Memo): Promise<void> {
    const retro = this.data.get(memo.date);
    if (retro) {
      // 同じvideo_idを持つメモを探す
      const existingMemoIndex = retro.memos.findIndex(
        (m) => m.video_id === memo.video_id
      );

      if (existingMemoIndex >= 0) {
        // 既存のメモを更新
        retro.memos[existingMemoIndex] = {
          ...memo,
          id: retro.memos[existingMemoIndex].id,
        };
      } else {
        // 新規メモを追加
        memo.id = retro.memos.length + 1;
        retro.memos.push(memo);
      }
    } else {
      // 新しいふりかえりを作成
      this.data.set(memo.date, {
        date: memo.date,
        videos: [],
        memos: [{ ...memo, id: 1 }],
      });
    }
  }

  async saveVideo(video: Video): Promise<number> {
    const id = Date.now(); // 簡易的なID生成
    video.id = id;
    return id;
  }

  async getVideosByDate(date: string): Promise<Video[]> {
    const retro = this.data.get(date);
    return retro?.videos || [];
  }

  async getMemosByDate(date: string): Promise<Memo[]> {
    const retro = this.data.get(date);
    return retro?.memos || [];
  }

  async deletePost(date: string, videoId: number): Promise<void> {
    const retro = this.data.get(date);
    if (!retro) return;

    // 動画を削除
    retro.videos = retro.videos.filter((v) => v.id !== videoId);

    // 動画に紐づくメモを削除
    retro.memos = retro.memos.filter((m) => m.video_id !== videoId);

    // ふりかえりを更新（動画もメモも空になった場合は削除）
    if (retro.videos.length === 0 && retro.memos.length === 0) {
      this.data.delete(date);
    } else {
      this.data.set(date, retro);
    }
  }
}

export const mockStorageAdapter = new MockStorageAdapter();
