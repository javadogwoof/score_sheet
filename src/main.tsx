import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeStorage } from '@/lib/storage'

const root = createRoot(document.getElementById('root')!)

// ストレージを初期化してからアプリを起動
try {
    await initializeStorage()
    root.render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
} catch {
    root.render(
        <div style={{ padding: '20px', color: 'red' }}>
            <h2>起動に失敗しました</h2>
            <p>アプリを起動し直してください。</p>
        </div>
    )
}
