import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/core/ThemeContext';
import { useGlassCapability } from '@/hooks/use-glass-capability';
import { TabIndex, TAB_LABELS } from '@/core/types';

const TABS = [TabIndex.Dashboard, TabIndex.Categories, TabIndex.Recurrings, TabIndex.Goals];

type Props = {
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
};

export function SegmentedControl({ selectedIndex, onSelectIndex }: Props) {
  const { themeColors } = useTheme();
  const isGlass = useGlassCapability();

  const containerStyle = isGlass
    ? [styles.container, styles.containerGlass]
    : [styles.container, { backgroundColor: themeColors.surface }];

  return (
    <View style={containerStyle}>
      <View style={styles.segmentRow}>
        {TABS.map((tab) => {
          const isSelected = selectedIndex === tab;
          const label = TAB_LABELS[tab as TabIndex];
          return (
            <Pressable
              key={tab}
              onPress={() => onSelectIndex(tab)}
              style={({ pressed }) => [
                styles.segment,
                isSelected && { backgroundColor: themeColors.primary },
                pressed && styles.segmentPressed,
              ]}
            >
              <Text
                style={[
                  styles.label,
                  {
                    color: isSelected ? themeColors.text.inverse : themeColors.text.secondary,
                  },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  containerGlass: {
    backgroundColor: 'transparent',
  },
  segmentRow: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  segmentPressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
