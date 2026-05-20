import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DigitalBusinessCard from './digital-business-card.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DigitalBusinessCard />
  </StrictMode>,
)
