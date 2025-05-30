import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Appp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
