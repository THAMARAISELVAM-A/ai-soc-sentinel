import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState, useEffect, Suspense, lazy } from 'react'
import './App.css'

console.log('SENTINEL: Loading...')

// Lazy load SplashGate
const SplashGate = lazy(() => import('./components/Core/SplashGate'))

function Loading() {
  return (
    <div style={{ 
      width: '100vw', height: '100vh', 
      background: '#010208', display: 'flex', 
      alignItems: 'center', justifyContent: 'center',
      color: '#0ea5e9', fontFamily: 'monospace'
    }}>
      LOADING...
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  
  console.log('SENTINEL: App rendering, started:', started)
  
  const handleStart = () => {
    console.log('SENTINEL: Starting...')
    setStarted(true)
  }
  
  if (started) {
    return (
      <div style={{ 
        width: '100vw', height: '100vh', 
        background: '#010208', display: 'flex', 
        alignItems: 'center', justifyContent: 'center',
        color: '#0ea5e9', fontFamily: 'monospace'
      }}>
        SENTINEL-ARM ACTIVE
      </div>
    )
  }
  
  return (
    <Suspense fallback={<Loading />}>
      <SplashGate onEngage={handleStart} />
    </Suspense>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

console.log('SENTINEL: Root rendered')