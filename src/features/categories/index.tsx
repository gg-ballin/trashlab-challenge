import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/core/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getCategoriesWithBudgets, getBudgetSummary } from '@/db/queries';
import { CategoriesDonut, type DonutSegment } from '@/components/CategoriesDonut';

const MONTH = 'Nov';

function progressBarColor(pct: number): string {
  if (pct >= 100) return '#DC2626';
  if (pct >= 80) return '#F97316';
  return '#059669';
}

type CategoriesScreenProps = { focusKey?: number };

export function CategoriesScreen({ focusKey = 0 }: CategoriesScreenProps) {
  const { themeColors, fontFamily } = useTheme();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const didInitExpand = useRef(false);

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

  const donutSegments: DonutSegment[] = useMemo(
    () =>
      groups.map((g) => ({
        color: g.dot_color,
        value: g.items.reduce((s, i) => s + i.spent, 0),
      })),
    [groups]
  );

  useEffect(() => {
    if (groups.length > 0 && !didInitExpand.current) {
      didInitExpand.current = true;
      setExpandedIds(new Set(groups.map((g) => g.id)));
    }
  }, [groups]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: themeColors.surface, marginBottom: 16 }]}>
        <View style={[styles.summarySection,]}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={[styles.summaryValue, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
                ${summary.totalSpent.toLocaleString()}
              </Text>
              <Text style={[styles.summaryLabel, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>
                spent in {MONTH}
              </Text>
            </View>
            <View>
              <CategoriesDonut segments={donutSegments} size={56} triggerKey={focusKey} />
            </View>
            <View>
              <Text style={[styles.summaryValue, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
                ${summary.totalBudget.toLocaleString()}
              </Text>
              <Text style={[styles.summaryLabel, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>
                total budget
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: themeColors.surface }]}>
        <View style={[styles.tableHeader, { borderBottomColor: themeColors.border }]}>
          <Text style={[styles.tableHeaderText, { color: themeColors.text.secondary, fontFamily: fontFamily.semiBold }]}>
            SPENT
          </Text>
          <Ionicons name="help-circle-outline" size={16} color={themeColors.text.secondary} />
          <Text style={[styles.tableHeaderText, { color: themeColors.text.secondary, fontFamily: fontFamily.semiBold }]}>
            BUDGET
          </Text>
        </View>
        {groups.map((group) => {
          const isExpanded = expandedIds.has(group.id);
          return (
            <View key={group.id} style={styles.group}>
              <Pressable
                onPress={() => toggleExpanded(group.id)}
                style={styles.groupHeader}
              >
                <Ionicons
                  name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                  size={16}
                  color={themeColors.text.main}
                />
                <Text style={[styles.groupName, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
                  {group.name}
                </Text>
              </Pressable>
              {isExpanded &&
                group.items.map((item) => {
                  const pct = item.budget > 0 ? Math.min(100, (item.spent / item.budget) * 100) : 0;
                  const barColor = progressBarColor(pct);
                  const fillPct = item.budget > 0 ? Math.min(100, (item.spent / item.budget) * 100) : 0;
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
                            { width: `${fillPct}%`, backgroundColor: barColor },
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
  summarySection: {
    paddingBottom: 16,
    marginBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryValue: { fontSize: 18 },
  summaryLabel: { fontSize: 12, marginTop: 2 },
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
