import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { getThemeColors, type ColorScheme, type ThemeColors } from './theme';

type ThemeContextValue = {
  colorScheme: ColorScheme;
  themeColors: ThemeColors;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const colorScheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';
  const themeColors = useMemo(() => getThemeColors(colorScheme), [colorScheme]);
  const value = useMemo(
    () => ({ colorScheme, themeColors }),
    [colorScheme, themeColors]
  );
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
