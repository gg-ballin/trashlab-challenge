import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider } from '@/core/ThemeContext';
import { initDb } from '@/db';

export default function RootLayout() {
  useEffect(() => {
    initDb();
  }, []);

  return (
    <ThemeProvider>
      <Stack />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
