import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/core/ThemeContext';
import { TabIndex, TAB_LABELS } from '@/core/types';

const TABS = [TabIndex.Dashboard, TabIndex.Categories, TabIndex.Recurrings, TabIndex.Goals];

type Props = {
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  /** When true, bar is on primary bg: unselected = white text; selected = secondary pill or white pill */
  onPrimaryBackground?: boolean;
  /** When true with onPrimaryBackground, selected tab uses secondary (light blue) pill; else white pill */
  selectedPillSecondary?: boolean;
  rightElement?: React.ReactNode;
};

export function SegmentedControl({
  selectedIndex,
  onSelectIndex,
  onPrimaryBackground,
  selectedPillSecondary,
  rightElement,
}: Props) {
  const { themeColors } = useTheme();

  const unselectedColor = onPrimaryBackground ? themeColors.text.inverse : themeColors.text.secondary;
  const selectedBg = onPrimaryBackground
    ? selectedPillSecondary
      ? themeColors.secondary
      : themeColors.text.inverse
    : themeColors.primary;
  const selectedColor =
    onPrimaryBackground
      ? selectedPillSecondary
        ? themeColors.primary
        : themeColors.text.main
      : themeColors.text.inverse;

  return (
    <View style={[styles.container, onPrimaryBackground && styles.containerTransparent]}>
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
                isSelected && { backgroundColor: selectedBg },
                pressed && styles.segmentPressed,
              ]}
            >
              <Text
                style={[styles.label, { color: isSelected ? selectedColor : unselectedColor }]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
        {rightElement != null ? <View style={styles.rightSlot}>{rightElement}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  containerTransparent: {
    backgroundColor: 'transparent',
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  rightSlot: {
    marginLeft: 8,
  },
  segmentPressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
