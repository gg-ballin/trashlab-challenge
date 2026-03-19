import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/core/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import {
  getBudgetSummary,
  getToReviewTransactions,
  getBudgetsForDashboard,
  markTransactionReviewed,
  type ToReviewTransaction,
} from '@/db/queries';
import { BudgetChart } from '@/components/BudgetChart';

function useDashboardData() {
  const [toReview, setToReview] = useState<ToReviewTransaction[]>(() => {
    try {
      return getToReviewTransactions();
    } catch {
      return [];
    }
  });
  const summary = useMemo(() => {
    try {
      return getBudgetSummary();
    } catch {
      return { totalBudget: 4120, totalSpent: 3780, left: 340 };
    }
  }, []);
  const budgets = useMemo(() => {
    try {
      return getBudgetsForDashboard();
    } catch {
      return [];
    }
  }, []);
  const handleMarkReviewed = (id: string) => {
    try {
      markTransactionReviewed(id);
      setToReview((prev) => prev.filter((t) => t.id !== id));
    } catch {}
  };
  return { summary, toReview, budgets, handleMarkReviewed };
}

export function DashboardScreen() {
  const { themeColors, fontFamily } = useTheme();
  const { summary, toReview, budgets, handleMarkReviewed } = useDashboardData();
  const overTotal = Math.max(0, summary.totalSpent - summary.totalBudget);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.budgetCard, { backgroundColor: themeColors.surface }]}>
        <View style={styles.budgetHeader}>
          <View style={styles.budgetHeaderTextWrap}>
            <Text style={[styles.budgetPrimary, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>
              ${summary.left.toLocaleString()} left
            </Text>
            <Text style={[styles.budgetSecondary, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>
              out of ${summary.totalBudget.toLocaleString()} budgeted
            </Text>
          </View>
          <View style={styles.budgetHelp}>
            <Ionicons name="help-circle-outline" size={20} color={themeColors.text.secondary} />
          </View>
        </View>
        <BudgetChart
          totalBudget={summary.totalBudget}
          totalSpent={summary.totalSpent}
          over={overTotal}
          fontFamily={fontFamily.semiBold}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>TO REVIEW</Text>
        <Text style={[styles.sectionLink, { color: themeColors.secondary, fontFamily: fontFamily.regular }]}>View all &gt;</Text>
      </View>
      {toReview.length > 0 ? (
        toReview.slice(0, 1).map((t) => (
          <View key={t.id} style={[styles.reviewCard, { backgroundColor: themeColors.surface }]}>
            <Text style={[styles.reviewSub, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>So far today</Text>
            <Text style={[styles.reviewMerchant, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>{t.name}</Text>
            <View style={styles.reviewMeta}>
              <Text style={[styles.reviewTag, { color: '#DC2626', fontFamily: fontFamily.semiBold }]}>
                {(t.category_name ?? 'UNCATEGORIZED').toUpperCase()}
              </Text>
              <Text style={[styles.reviewAmount, { color: themeColors.text.main, fontFamily: fontFamily.regular }]}>
                ${t.amount.toFixed(2)}
              </Text>
              <View style={[styles.reviewDot, { backgroundColor: themeColors.primary }]} />
            </View>
            <Pressable
              style={[styles.reviewButton, { backgroundColor: themeColors.primary }]}
              onPress={() => handleMarkReviewed(t.id)}
            >
              <Text style={[styles.reviewButtonText, { color: themeColors.text.inverse, fontFamily: fontFamily.semiBold }]}>
                MARK AS REVIEWED
              </Text>
            </Pressable>
          </View>
        ))
        ) : (
        <View style={[styles.reviewCard, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.reviewMerchant, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>
            No transactions to review
          </Text>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>BUDGETS</Text>
        <Text style={[styles.sectionLink, { color: themeColors.secondary, fontFamily: fontFamily.regular }]}>Categories &gt;</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.budgetsRow}
      >
        {budgets.map((b) => {
          const over = (b.over ?? 0) > 0;
          const left = Math.max(0, b.budget - b.spent);
          const label = over ? `$${Math.round(b.over!)} over` : `$${left.toFixed(2)} left`;
          return (
            <View key={b.category_id} style={[styles.budgetCircle, { borderColor: themeColors.border }]}>
              <View
                style={[
                  styles.budgetCircleInner,
                  {
                    borderColor: over ? '#DC2626' : themeColors.secondary,
                    backgroundColor: themeColors.surface,
                  },
                ]}
              >
                <Text style={styles.emoji}>{b.emoji}</Text>
              </View>
              <Text style={[styles.budgetCircleLabel, { color: themeColors.text.main, fontFamily: fontFamily.regular }]}>
                {label}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: themeColors.text.main, fontFamily: fontFamily.semiBold }]}>UPCOMING</Text>
        <Text style={[styles.sectionLink, { color: themeColors.secondary, fontFamily: fontFamily.regular }]}>Recurrings &gt;</Text>
      </View>
      <View style={[styles.upcomingCard, { backgroundColor: themeColors.surface }]}>
        <Text style={[styles.upcomingItem, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>tomorrow</Text>
        <Text style={[styles.upcomingItem, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>in a week</Text>
        <Text style={[styles.upcomingItem, { color: themeColors.text.secondary, fontFamily: fontFamily.regular }]}>in 14 days</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  budgetCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetHeaderTextWrap: { flex: 1 },
  budgetPrimary: { fontSize: 22, fontWeight: '700' },
  budgetSecondary: { fontSize: 14, marginTop: 2 },
  budgetHelp: { marginLeft: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 14, fontWeight: '600' },
  sectionLink: { fontSize: 14 },
  reviewCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  reviewSub: { fontSize: 12, marginBottom: 4 },
  reviewMerchant: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  reviewMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  reviewTag: { fontSize: 12, fontWeight: '600' },
  reviewAmount: { fontSize: 14 },
  reviewDot: { width: 8, height: 8, borderRadius: 4 },
  reviewButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewButtonText: { fontSize: 14, fontWeight: '600' },
  budgetsRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  budgetCircle: { alignItems: 'center', width: 72 },
  budgetCircleInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emoji: { fontSize: 24 },
  budgetCircleLabel: { fontSize: 12 },
  upcomingCard: {
    borderRadius: 12,
    padding: 16,
  },
  upcomingItem: { fontSize: 14, paddingVertical: 4 },
});
