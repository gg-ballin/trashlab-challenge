import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { getThemeColors, type ColorScheme, type ThemeColors } from './theme';
import { getStoredColorScheme, setStoredColorScheme } from './storage';

type ThemeContextValue = {
  colorScheme: ColorScheme;
  themeColors: ThemeColors;
  setColorScheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const stored = getStoredColorScheme();
  const initialScheme: ColorScheme =
    stored ?? (systemScheme === 'dark' ? 'dark' : 'light');
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(initialScheme);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setStoredColorScheme(scheme);
    setColorSchemeState(scheme);
  }, []);

  const themeColors = useMemo(() => getThemeColors(colorScheme), [colorScheme]);
  const value = useMemo(
    () => ({ colorScheme, themeColors, setColorScheme }),
    [colorScheme, themeColors, setColorScheme]
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
