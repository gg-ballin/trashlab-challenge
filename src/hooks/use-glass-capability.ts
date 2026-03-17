import { Platform } from 'react-native';

/**
 * Returns true when glass/liquid glass UI can be used (e.g. iOS 26+).
 * Wire to expo-glass-effect's isLiquidGlassAvailable() when that dependency is added.
 */
export function useGlassCapability(): boolean {
  if (Platform.OS !== 'ios') return false;
  const version = typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version;
  return version >= 26;
}
