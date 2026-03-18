import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'trashlab-app' });

const COLOR_SCHEME_KEY = 'app:colorScheme';

export type StoredColorScheme = 'light' | 'dark';

export function getStoredColorScheme(): StoredColorScheme | undefined {
  try {
    const raw = storage.getString(COLOR_SCHEME_KEY);
    if (raw === 'light' || raw === 'dark') return raw;
  } catch {
    // MMKV may not be ready on first paint
  }
  return undefined;
}

export function setStoredColorScheme(scheme: StoredColorScheme): void {
  try {
    storage.set(COLOR_SCHEME_KEY, scheme);
  } catch {
    // ignore
  }
}
