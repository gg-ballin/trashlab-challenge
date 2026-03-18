import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/core/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { getGoalsActive, getGoalsReady, getGoalsSummary } from '@/db/queries';

const MONTH = 'Nov';
const GOAL_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  'car',
  'shield-checkmark',
  'airplane',
  'heart',
];

export function GoalsScreen() {
  const { themeColors } = useTheme();
  const summary = useMemo(() => {
    try {
      return getGoalsSummary();
    } catch {
      return { saved: 1200, toGo: 13 };
    }
  }, []);
  const activeGoals = useMemo(() => {
    try {
      return getGoalsActive();
    } catch {
      return [];
    }
  }, []);
  const readyGoals = useMemo(() => {
    try {
      return getGoalsReady();
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
          <Text style={[styles.summaryBig, { color: themeColors.text.main }]}>
            ${summary.saved.toLocaleString()} saved in {MONTH}
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
          <Text style={[styles.summaryBig, { color: themeColors.text.main }]}>
            ${Math.round(summary.toGo)} to go in {MONTH}
          </Text>
        </View>
        <View style={styles.sectionHeader}>
          <Ionicons name="chevron-down" size={16} color={themeColors.text.inverse} />
          <Text style={[styles.sectionTitle, { color: themeColors.text.main }]}>Active</Text>
        </View>
        {activeGoals.map((goal, idx) => {
          const progress = goal.target_amount > 0 ? goal.saved_amount / goal.target_amount : 0;
          const icon = GOAL_ICONS[idx % GOAL_ICONS.length];
          const useBar = goal.name !== 'Emergency Fund';
          return (
            <View
              key={goal.id}
              style={[styles.goalRow, { borderBottomColor: themeColors.border }]}
            >
              <Ionicons
                name={icon}
                size={24}
                color={themeColors.text.main}
                style={styles.goalIcon}
              />
              <View style={styles.goalMain}>
                <Text style={[styles.goalName, { color: themeColors.text.main }]}>{goal.name}</Text>
                {useBar ? (
                  <View style={[styles.progressBarBg, { backgroundColor: themeColors.border }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${progress * 100}%`,
                          backgroundColor: progress >= 0.7 ? '#059669' : '#F97316',
                        },
                      ]}
                    />
                  </View>
                ) : (
                  <View style={styles.dotsRow}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          {
                            backgroundColor: i === 1 ? '#059669' : themeColors.border,
                          },
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.goalRight}>
                <Text style={[styles.goalAmount, { color: themeColors.text.main }]}>
                  ${goal.saved_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}
                </Text>
                {goal.target_date && (
                  <View style={styles.dateRow}>
                    <Ionicons name="bookmark-outline" size={12} color={themeColors.text.secondary} />
                    <Text style={[styles.dateText, { color: themeColors.text.secondary }]}>
                      {goal.target_date}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Ionicons name="chevron-down" size={16} color={themeColors.text.inverse} />
          <Text style={[styles.sectionTitle, { color: themeColors.text.main }]}>
            Ready to spend
          </Text>
        </View>
        {readyGoals.map((goal) => (
          <View
            key={goal.id}
            style={[styles.readyRow, { borderBottomColor: themeColors.border }]}
          >
            <Ionicons name="heart" size={24} color={themeColors.text.main} />
            <Text style={[styles.goalName, { color: themeColors.text.main }]}>{goal.name}</Text>
            <View style={styles.readyActions}>
              <View style={[styles.circleBtn, { backgroundColor: themeColors.surface }]}>
                <Ionicons name="settings-outline" size={18} color={themeColors.text.main} />
              </View>
              <View style={[styles.circleBtn, { backgroundColor: themeColors.primary }]}>
                <Ionicons name="add" size={24} color={themeColors.text.inverse} />
              </View>
            </View>
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
    marginBottom: 20,
  },
  summaryBig: { fontSize: 15, fontWeight: '600' },
  ringWrapper: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  goalIcon: { marginRight: 12 },
  goalMain: { flex: 1 },
  goalName: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: { height: '100%', borderRadius: 4 },
  dotsRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  goalRight: { alignItems: 'flex-end' },
  goalAmount: { fontSize: 14, fontWeight: '600' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  dateText: { fontSize: 12 },
  readyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  readyActions: { flexDirection: 'row', gap: 8, marginLeft: 'auto' },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
