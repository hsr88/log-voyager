import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Theme } from '../types';

const darkTheme: Theme = {
  name: 'dark',
  background: '#050505',
  foreground: '#e2e8f0',
  accent: '#00f3ff',
  accentSecondary: '#ff00ff',
  panel: 'rgba(20, 20, 25, 0.7)',
  border: 'rgba(255, 255, 255, 0.08)',
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    muted: '#64748b',
  },
  logLevels: {
    error: '#ef4444',
    warn: '#fb923c',
    info: '#3b82f6',
    debug: '#6b7280',
  },
};

const lightTheme: Theme = {
  name: 'light',
  background: '#e2e8f0',  // Slate-200 - przyciemniony szary
  foreground: '#334155',  // Slate-700 - mniej kontrastu
  accent: '#0ea5e9',      // Sky-500 - łagodniejszy niebieski
  accentSecondary: '#db2777',
  panel: 'rgba(203, 213, 225, 0.7)',  // Slate-300 z przezroczystością
  border: 'rgba(0, 0, 0, 0.08)',  // Subtelniejsze obramowania
  text: {
    primary: '#475569',   // Slate-600 - mniej agresywny
    secondary: '#64748b', // Slate-500
    muted: '#94a3b8',     // Slate-400
  },
  logLevels: {
    error: '#dc2626',
    warn: '#ea580c',
    info: '#2563eb',
    debug: '#6b7280',
  },
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('logvoyager_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('logvoyager_theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const setTheme = (t: 'dark' | 'light') => setIsDark(t === 'dark');

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
