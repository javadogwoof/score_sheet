import styles from './YouTubePlayer.module.css'

export interface YouTubePlayerProps {
  videoId: string
}

export function YouTubePlayer(props: YouTubePlayerProps) {
    const { videoId } = props

  return (
    <div className={styles.container}>
        <div className={styles.playerWrapper}>
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            ></iframe>
        </div>
    </div>
  )
}
