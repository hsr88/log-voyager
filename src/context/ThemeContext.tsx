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
  background: '#f4f7fb',
  foreground: '#172033',
  accent: '#0877d1',
  accentSecondary: '#db2777',
  panel: 'rgba(255, 255, 255, 0.92)',
  border: 'rgba(15, 23, 42, 0.14)',
  text: {
    primary: '#111827',
    secondary: '#475569',
    muted: '#64748b',
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
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#050505' : '#f4f7fb');
  }, [isDark]);

  const toggleTheme = () => setIsDark((current) => !current);
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
