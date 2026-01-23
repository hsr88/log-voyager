import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LandingPage from './LandingPage.tsx'
import SharedViewer from './SharedViewer.tsx'
import HowItWorks from './HowItWorks.tsx'

// Sprawdzamy, czy włączony jest tryb Landing Page (tylko na produkcji/SaaS)
const showLanding = import.meta.env.VITE_SHOW_LANDING === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Scenariusz A: Mamy Landing Page (SaaS) */}
        {showLanding ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/app" element={<App />} />
            <Route path="/s/:id" element={<SharedViewer />} />
          </>
        ) : (
          /* Scenariusz B: Open Source / Docker (Bez marketingu) */
          <>
            {/* Główna ścieżka od razu ładuje aplikację */}
            <Route path="/" element={<App />} />
            {/* Przekierowanie /app na główną (dla kompatybilności linków) */}
            <Route path="/app" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
