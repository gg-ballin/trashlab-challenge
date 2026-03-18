import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider } from '@/core/ThemeContext';
import { initDb } from '@/db';

// Ensure DB is ready before any screen queries it
initDb();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
