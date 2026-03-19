import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/core/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getRecurringsForMonth, getRecurringsSummary } from '@/db/queries';
import { CategoriesDonut, type DonutSegment } from '@/components/CategoriesDonut';

const TRACK_COLOR = '#4E6B8A';

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

const CHECKMARK_COLORS = ['#EC4899', '#F97316', '#06B6D4', '#3B82F6', '#FFFFFF'];

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

  const donutSegments: DonutSegment[] = useMemo(() => {
    const paid = summary.paidSoFar;
    const left = summary.leftToPay;
    if (left <= 0) return [{ color: themeColors.secondary, value: paid }];
    return [
      { color: themeColors.secondary, value: paid },
      { color: TRACK_COLOR, value: left },
    ];
  }, [summary.paidSoFar, summary.leftToPay, themeColors.secondary]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.summaryCard, { backgroundColor: themeColors.surface }]}>
        <View style={[styles.summarySection, { borderBottomColor: themeColors.border }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBlock}>
              <Text style={[styles.summaryValue, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
                ${summary.leftToPay.toFixed(0)}
              </Text>
              <Text style={[styles.summaryLabel, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>
                left to pay
              </Text>
            </View>
            <View style={styles.summaryChartWrap}>
              <CategoriesDonut segments={donutSegments} size={56} />
            </View>
            <View style={styles.summaryBlockRight}>
              <Text style={[styles.summaryValue, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
                ${summary.paidSoFar.toLocaleString()}
              </Text>
              <Text style={[styles.summaryLabel, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>
                paid so far
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, { color: themeColors.text.secondary, fontFamily: fontFamily.semiBold }]}>
          THIS MONTH
        </Text>
        <Ionicons name="grid-outline" size={18} color={themeColors.text.secondary} />
      </View>

      {items.map((item, index) => {
        const iconName = (item.icon && ICON_MAP[item.icon]) ? ICON_MAP[item.icon] : 'ellipse-outline';
        const amountStr =
          item.amount < 100 && item.amount !== Math.floor(item.amount)
            ? item.amount.toFixed(2)
            : item.amount.toLocaleString();
        const checkColor = item.paid === 1 ? CHECKMARK_COLORS[index % CHECKMARK_COLORS.length] : undefined;
        return (
          <View
            key={item.id}
            style={[styles.itemCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
          >
            <Text style={[styles.date, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>
              {formatDueDay(item.due_day)}
            </Text>
            <Ionicons name={iconName} size={22} color={themeColors.text.main} style={styles.rowIcon} />
            <Text style={[styles.name, { color: themeColors.text.main, fontFamily: fontFamily.regular }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.amount, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
              ${amountStr}
            </Text>
            {item.paid === 1 && checkColor ? (
              <Ionicons name="checkmark-circle" size={22} color={checkColor} />
            ) : (
              <View style={styles.checkPlaceholder} />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  summarySection: {
    paddingBottom: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryBlock: { flex: 1 },
  summaryChartWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  summaryBlockRight: { flex: 1, alignItems: 'flex-end' },
  summaryValue: { fontSize: 18 },
  summaryLabel: { fontSize: 12, marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    gap: 10,
  },
  date: { fontSize: 14, width: 32 },
  rowIcon: {},
  name: { flex: 1, fontSize: 14 },
  amount: { fontSize: 14 },
  checkPlaceholder: { width: 22, height: 22 },
});
