  // DarkModeToggle.js
import React, { useState, useEffect } from 'react';

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage for user preference
    const storedDarkMode = localStorage.getItem('darkMode');
    return storedDarkMode === 'true';
  });

  // Update local storage when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <label>
      Dark Mode
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
    </label>
  );
}

export default DarkModeToggle;
