import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/core/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getCategoriesWithBudgets, getBudgetSummary } from '@/db/queries';

const MONTH = 'Nov';

export function CategoriesScreen() {
  const { themeColors, fontFamily } = useTheme();
  const summary = useMemo(() => {
    try {
      return getBudgetSummary();
    } catch {
      return { totalSpent: 3780, totalBudget: 4120 };
    }
  }, []);
  const groups = useMemo(() => {
    try {
      return getCategoriesWithBudgets();
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
          <Text style={[styles.summaryText, { color: themeColors.text.main, fontFamily: fontFamily.regular }]}>
            ${summary.totalSpent.toLocaleString()} spent in {MONTH}
          </Text>
          <View style={styles.doughnutPlaceholder}>
            <View
              style={[
                styles.doughnutRing,
                {
                  borderColor: themeColors.secondary,
                  backgroundColor: themeColors.surface,
                },
              ]}
            />
          </View>
          <Text style={[styles.summaryText, { color: themeColors.text.main, fontFamily: fontFamily.regular }]}>
            ${summary.totalBudget.toLocaleString()} total budget
          </Text>
        </View>
        <View style={[styles.tableHeader, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.tableHeaderText, { color: themeColors.text.secondary, fontFamily: fontFamily.semiBold }]}>
            SPENT
          </Text>
          <Ionicons name="help-circle-outline" size={16} color={themeColors.text.secondary} />
          <Text style={[styles.tableHeaderText, { color: themeColors.text.secondary, fontFamily: fontFamily.semiBold }]}>
            BUDGET
          </Text>
        </View>
        {groups.map((group) => (
          <View key={group.id} style={styles.group}>
            <View style={styles.groupHeader}>
              <Ionicons name="chevron-down" size={16} color={themeColors.text.inverse} />
              <Text style={[styles.groupName, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>{group.name}</Text>
            </View>
            {group.items.map((item) => {
              const over = item.spent > item.budget;
              const pct = item.budget > 0 ? Math.min(100, (item.spent / item.budget) * 100) : 0;
              return (
                <View
                  key={item.id}
                  style={[styles.categoryRow, { borderBottomColor: themeColors.border }]}
                >
                  <View style={[styles.dot, { backgroundColor: group.dot_color }]} />
                  <Text style={[styles.categoryName, { color: themeColors.text.main, fontFamily: fontFamily.regular }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.amount, { color: themeColors.text.main, fontFamily: fontFamily.regular }]}>
                    ${item.spent.toLocaleString()}
                  </Text>
                  <View style={[styles.progressBarBg, { backgroundColor: themeColors.border }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${pct}%`,
                          backgroundColor: over ? '#DC2626' : '#059669',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.amount, { color: themeColors.text.main, fontFamily: fontFamily.regular }]}>
                    ${item.budget.toLocaleString()}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
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
    marginBottom: 16,
  },
  summaryText: { fontSize: 14 },
  doughnutPlaceholder: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  doughnutRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  tableHeaderText: { fontSize: 11, fontWeight: '600' },
  group: { marginTop: 8 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  groupName: { fontSize: 15, fontWeight: '600' },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  categoryName: { flex: 1, fontSize: 14 },
  amount: { fontSize: 14, minWidth: 52 },
  progressBarBg: {
    width: 60,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 3 },
});
