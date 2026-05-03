import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { readPreferences } from '../utils/preferences';

const ThemeContext = createContext();

const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  } catch {
    return false;
  }
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(getStoredTheme());

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', darkMode);

    const { rememberTheme } = readPreferences();
    if (rememberTheme) {
      try {
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      } catch {}
    } else {
      try {
        localStorage.removeItem('theme');
      } catch {}
    }
  }, [darkMode]);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return undefined;

    const handleChange = (event) => {
      try {
        const stored = localStorage.getItem('theme');
        if (!stored) {
          setDarkMode(event.matches);
        }
      } catch {}
    };

    media.addEventListener?.('change', handleChange);
    return () => media.removeEventListener?.('change', handleChange);
  }, []);

  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      toggleTheme: () => setDarkMode((current) => !current)
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
