import { View, Text } from 'react-native';
import { useTheme } from '@/core/ThemeContext';

export function CategoriesScreen() {
  const { themeColors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background, padding: 16 }}>
      <Text style={{ color: themeColors.text.main }}>Categories</Text>
    </View>
  );
}
