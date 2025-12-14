import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeStorage } from '@/lib/storage'

const root = createRoot(document.getElementById('root')!)

// ストレージを初期化してからアプリを起動
initializeStorage()
  .then(() => {
    console.log('Storage initialized successfully')
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch((error) => {
    console.error('Failed to initialize storage:', error)
    // エラーが発生してもUIを表示
    root.render(
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>ストレージの初期化に失敗しました</h1>
        <pre>{error?.message || String(error)}</pre>
        <p>開発者ツールのコンソールを確認してください。</p>
      </div>
    )
  })
