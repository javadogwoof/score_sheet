import styles from '@/App.module.scss'
import RetrospectivePage from "@/pages/RetrospectivePage.tsx";

function App() {
  return <div className={styles.container}>
      <RetrospectivePage videoId={"FO6P4FoLRPU"} />
  </div>
}

export default App
