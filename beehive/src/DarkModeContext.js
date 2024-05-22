// DarkModeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

export const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode state from localStorage when the component mounts
  useEffect(() => {
    const savedDarkMode = window.localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const parsedDarkMode = JSON.parse(savedDarkMode);
      setDarkMode(parsedDarkMode);
      console.log('Loaded dark mode state from localStorage:', parsedDarkMode);
    }
  }, []);

  // Save dark mode state to localStorage whenever it changes
  useEffect(() => {
    window.localStorage.setItem('darkMode', JSON.stringify(darkMode));
    console.log('Saved dark mode state to localStorage:', darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
