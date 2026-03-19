import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/core/ThemeContext';
import { TabIndex, TAB_LABELS } from '@/core/types';

const TABS = [TabIndex.Dashboard, TabIndex.Categories, TabIndex.Recurrings, TabIndex.Goals];

type Props = {
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  /** When true, bar is on primary bg: selected = white pill + primary text; unselected = white text */
  onPrimaryBackground?: boolean;
  rightElement?: React.ReactNode;
};

export function SegmentedControl({
  selectedIndex,
  onSelectIndex,
  onPrimaryBackground,
  rightElement,
}: Props) {
  const { themeColors, fontFamily } = useTheme();

  const unselectedColor = onPrimaryBackground ? '#FFFFFF' : themeColors.text.secondary;
  const selectedBg = onPrimaryBackground ? '#FFFFFF' : themeColors.primary;
  const selectedColor = onPrimaryBackground ? themeColors.primary : themeColors.text.inverse;

  return (
    <View style={[styles.container, onPrimaryBackground && styles.containerTransparent]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
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
                  style={[
                    styles.label,
                    { color: isSelected ? selectedColor : unselectedColor, fontFamily: fontFamily.semiBold },
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
          {rightElement != null ? <View style={styles.rightSlot}>{rightElement}</View> : null}
        </View>
      </ScrollView>
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
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingRight: 8,
  },
  segment: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    minWidth: 0,
  },
  rightSlot: {
    marginLeft: 8,
  },
  segmentPressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 13,
  },
});
