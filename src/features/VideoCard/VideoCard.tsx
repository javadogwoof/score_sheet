import { useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { Card } from '@/components/Card/Card';
import { YouTubePlayer } from '@/features/YouTubePlayer';
import { videoKeys } from '@/hooks/queries/keys';
import type { Post, Video } from '@/lib/domain/types';
import { NotFoundError } from '@/lib/errors';
import { addReflectionToVideo } from '@/lib/repositories/reflectionRepository';
import styles from './VideoCard.module.scss';

interface VideoCardProps {
  id: string;
  videoId: string;
  initialPosts: Post[];
  date: string;
}

export const VideoCard = memo(
  ({ id, videoId, initialPosts, date }: VideoCardProps) => {
    const queryClient = useQueryClient();

    // VideoCard内で投稿リストを管理
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [newPostContent, setNewPostContent] = useState('');

    // initialPostsが変更されたらpostsを更新（ページ移動後の再表示時）
    useEffect(() => {
      setPosts(initialPosts);
    }, [initialPosts]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewPostContent(e.target.value);
    };

    const handleSubmit = useCallback(async () => {
      if (!newPostContent.trim()) return;

      const content = newPostContent;
      const newPost: Post = {
        id: crypto.randomUUID(),
        content,
      };

      // 楽観的更新：即座にUIに反映
      setPosts((prev) => [...prev, newPost]);
      setNewPostContent('');

      try {
        // バックグラウンドでDBに保存
        await addReflectionToVideo(id, content);

        // TanStack Queryのキャッシュも更新（永続化のため）
        queryClient.setQueryData<Video[]>(
          videoKeys.byDate(date),
          (oldVideos) => {
            if (!oldVideos) return oldVideos;

            const index = oldVideos.findIndex((v) => v.id === id);
            if (index === -1) return oldVideos;

            const newVideos = [...oldVideos];
            newVideos[index] = {
              ...oldVideos[index],
              posts: [...oldVideos[index].posts, newPost],
            };
            return newVideos;
          },
        );
      } catch (error) {
        // エラー時はロールバック
        setPosts((prev) => prev.filter((p) => p.id !== newPost.id));

        if (error instanceof NotFoundError) {
          alert('動画が見つかりません。ページを再読み込みしてください。');
        } else {
          alert('投稿の追加に失敗しました');
        }
      }
    }, [newPostContent, id, date, queryClient]);

    return (
      <Card>
        <div className={styles.container}>
          <YouTubePlayer videoId={videoId} />

          {/* 新規投稿入力 */}
          <div className={styles.inputSection}>
            <input
              className={styles.memo}
              type="text"
              value={newPostContent}
              onChange={handleChange}
              placeholder="新しい投稿を入力..."
            />
            <button
              type="button"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={!newPostContent.trim()}
              aria-label="投稿を追加"
            >
              <IoSend />
            </button>
          </div>

          {/* 過去の投稿一覧 */}
          {[...posts].reverse().map((post) => (
            <div key={post.id} className={styles.postItem}>
              <p className={styles.postContent}>{post.content}</p>
            </div>
          ))}
        </div>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // idとvideoIdが同じなら再レンダリングしない
    // initialPostsとdateの変更は無視（VideoCard内で状態管理するため）
    return (
      prevProps.id === nextProps.id && prevProps.videoId === nextProps.videoId
    );
  },
);
