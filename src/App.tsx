import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import viteLogo from '/vite.svg'
import styles from '@/App.module.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className={`${styles.logo} ${styles.logoReact}`} alt="React logo" />
        </a>
      </div>
      <h1 className={styles.title}>Vite + React + Capacitor</h1>
      <div className={styles.card}>
        <button className={styles.button} onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p className={styles.description}>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className={styles.description}>
        Module CSS を使用したスタイリング
      </p>
    </div>
  )
}

export default App
