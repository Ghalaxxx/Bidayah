import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MediaReview } from './components/MediaReview.tsx'
import './App.css'

const internalReview = import.meta.env.DEV && new URLSearchParams(location.search).get('media-review') === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {internalReview ? <MediaReview /> : <App />}
  </StrictMode>,
)
