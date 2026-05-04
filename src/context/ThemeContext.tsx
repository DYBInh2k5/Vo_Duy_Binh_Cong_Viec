import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'bauhaus' | 'draft';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('portfolio-theme');
    return (saved as ThemeMode) || 'bauhaus';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-theme', mode);
    if (mode === 'draft') {
      document.body.classList.add('draft-mode');
    } else {
      document.body.classList.remove('draft-mode');
    }
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'bauhaus' ? 'draft' : 'bauhaus');
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
