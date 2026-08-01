import React, { createContext, useContext, useState } from 'react';
import type { DiagramTheme } from '../types/theme';
import { defaultTheme } from '../types/theme';

interface ThemeContextType {
  theme: DiagramTheme;
  updateTheme: (newTheme: Partial<DiagramTheme>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<DiagramTheme>(defaultTheme);

  const updateTheme = (newTheme: Partial<DiagramTheme>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  const resetTheme = () => setTheme(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé à l'intérieur de ThemeProvider");
  }
  return context;
};