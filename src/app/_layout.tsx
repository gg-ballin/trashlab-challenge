import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider } from '@/core/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
