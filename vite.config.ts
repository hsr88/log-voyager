import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Aplikacja zaktualizuje się sama po odświeżeniu
      includeAssets: ['favicon.svg', 'og-image.png'], // Pliki statyczne do cache'owania
      manifest: {
        name: 'Log Voyager',
        short_name: 'LogVoyager',
        description: 'Analyze huge log files instantly in your device.',
        theme_color: '#050505', // Pasuje do Twojego tła
        background_color: '#050505',
        display: 'standalone', // Ukrywa pasek adresu przeglądarki
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Ważne dla Androida (ikony adaptacyjne)
          }
        ]
      },
      workbox: {
        // Cache'ujemy wszystko, żeby działało offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
})