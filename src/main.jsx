import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Debug - log when React starts
console.log('SENTINEL: Starting app...')

window.addEventListener('error', (e) => {
  console.error('SENTINEL ERROR:', e.message, e.filename)
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('SENTINEL REJECTION:', e.reason)
})

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log('SENTINEL: App mounted')