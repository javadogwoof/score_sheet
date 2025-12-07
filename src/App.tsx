import { YouTubePlayer } from '@/components/YouTubePlayer'
import styles from '@/App.module.scss'

function App() {
  return <div className={styles.container}>
      <YouTubePlayer videoId="FO6P4FoLRPU" />
  </div>
}

export default App
