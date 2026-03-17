export const theme = {
  light: {
    colors: {
      primary: '#2D3494',
      secondary: '#00D1FF',
      background: '#FFFFFF',
      surface: '#F8F9FC',
      text: {
        main: '#1A1A1A',
        secondary: '#4B5563',
        inverse: '#FFFFFF',
      },
      border: '#E5E7EB',
      card: '#FFFFFF',
    },
  },
  dark: {
    colors: {
      primary: '#2D3494',
      secondary: '#00D1FF',
      background: '#0F1133',
      surface: '#1D215E',
      text: {
        main: '#FFFFFF',
        secondary: '#BDC1FF',
        inverse: '#1A1A1A',
      },
      border: '#4D55B2',
      card: 'rgba(255, 255, 255, 0.05)',
    },
  },
} as const;

export type ColorScheme = 'light' | 'dark';

export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: { main: string; secondary: string; inverse: string };
  border: string;
  card: string;
};

export function getThemeColors(mode: ColorScheme): ThemeColors {
  return mode === 'dark' ? theme.dark.colors : theme.light.colors;
}
