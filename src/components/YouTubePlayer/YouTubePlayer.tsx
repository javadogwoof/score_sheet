import styles from './YouTubePlayer.module.scss'

export interface YouTubePlayerProps {
  videoId: string
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  return (
    <iframe
      className={styles.iframe}
      src={`https://javadogwoof.github.io/score_sheet/?v=${videoId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    />
  )
}
