import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Import the main App component
import App from './components/_App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
