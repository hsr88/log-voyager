import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cc.logvoyager.app', // Unikalne ID Twojej aplikacji w sklepie Play
  appName: 'Log Voyager',
  webDir: 'dist', // Katalog, w którym Vite buduje stronę
  server: {
    androidScheme: 'https' // Wymagane dla poprawnego działania na nowszych Androidach
  },
  plugins: {
    // Tutaj będziemy konfigurować pluginy, np. do klawiatury czy paska statusu
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
};

export default config;