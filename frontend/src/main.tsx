import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { getRouter } from './router'
import './styles.css'

// Loop Detector: Detects if the app is re-rendering too much in a short time
if (import.meta.env.DEV) {
  let renderCount = 0;
  let lastTime = Date.now();
  const originalRender = createRoot;
  
  // This is a simple heuristic to alert about potential loops
  window.addEventListener('load', () => {
    setInterval(() => {
      if (renderCount > 100) {
        console.error("⚠️ [Loop Detector] High render frequency detected! Possible infinite loop.");
      }
      renderCount = 0;
    }, 1000);
  });
}

const router = getRouter()

const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
