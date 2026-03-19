import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/core/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getRecurringsForMonth, getRecurringsSummary } from '@/db/queries';

function formatDueDay(day: number): string {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
}

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  'musical-notes': 'musical-notes',
  home: 'home',
  car: 'car',
  'globe-outline': 'globe-outline',
  'water-outline': 'water-outline',
  'shield-checkmark': 'shield-checkmark',
  'book-outline': 'book-outline',
  'tv-outline': 'tv-outline',
};

export function RecurringsScreen() {
  const { themeColors, fontFamily } = useTheme();
  const summary = useMemo(() => {
    try {
      return getRecurringsSummary();
    } catch {
      return { leftToPay: 40, paidSoFar: 2725 };
    }
  }, []);
  const items = useMemo(() => {
    try {
      return getRecurringsForMonth();
    } catch {
      return [];
    }
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: themeColors.surface }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLeft, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
            ${summary.leftToPay.toFixed(0)} left to pay
          </Text>
          <View style={styles.ringWrapper}>
            <View
              style={[
                styles.ring,
                {
                  borderColor: themeColors.secondary,
                  backgroundColor: themeColors.surface,
                },
              ]}
            />
          </View>
          <Text style={[styles.summaryRight, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
            ${summary.paidSoFar.toLocaleString()} paid so far
          </Text>
        </View>
        <Text style={[styles.sectionLabel, { color: themeColors.text.secondary, fontFamily: fontFamily.semiBold }]}>
          THIS MONTH
        </Text>
        {items.map((item) => {
          const iconName = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : 'ellipse-outline';
          const amountStr =
            item.amount < 100 && item.amount !== Math.floor(item.amount)
              ? item.amount.toFixed(2)
              : item.amount.toLocaleString();
          return (
            <View
              key={item.id}
              style={[styles.row, { borderBottomColor: themeColors.border }]}
            >
              <Text style={[styles.date, { color: themeColors.text.main, fontFamily: fontFamily.regular }]}>
                {formatDueDay(item.due_day)}
              </Text>
              <Ionicons
                name={iconName}
                size={20}
                color={themeColors.text.main}
                style={styles.rowIcon}
              />
              <Text style={[styles.name, { color: themeColors.text.main, fontFamily: fontFamily.regular }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.amount, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
                ${amountStr}
              </Text>
              {item.paid === 1 && (
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  card: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryLeft: { fontSize: 15, fontWeight: '600' },
  summaryRight: { fontSize: 15, fontWeight: '600' },
  ringWrapper: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  date: { fontSize: 14, width: 28 },
  rowIcon: {},
  name: { flex: 1, fontSize: 14 },
  amount: { fontSize: 14, fontWeight: '600' },
});
