import styles from './YouTubePlayer.module.scss';

export interface YouTubePlayerProps {
  videoId: string;
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  return (
    <iframe
      title="YouTube video player"
      className={styles.iframe}
      src={`https://score-sheet.taiga221-develop.workers.dev/?v=${videoId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
    />
  );
}
