import { getDb } from './index';

const MONTH = 'Nov';

export type BudgetSummary = {
  totalBudget: number;
  totalSpent: number;
  left: number;
};

export function getBudgetSummary(): BudgetSummary {
  const db = getDb();
  const rows = db.getAllSync<{ total_budget: number; total_spent: number }>(
    `SELECT SUM(budget) as total_budget, SUM(spent) as total_spent FROM budgets WHERE month = ?`,
    MONTH
  );
  const r = rows[0];
  const totalBudget = r?.total_budget ?? 0;
  const totalSpent = r?.total_spent ?? 0;
  return {
    totalBudget,
    totalSpent,
    left: Math.max(0, totalBudget - totalSpent),
  };
}

export type ToReviewTransaction = {
  id: string;
  name: string;
  amount: number;
  category_id: string | null;
  category_name: string | null;
};

export function getToReviewTransactions(): ToReviewTransaction[] {
  const db = getDb();
  return db.getAllSync<ToReviewTransaction>(
    `SELECT t.id, t.name, t.amount, t.category_id, c.name as category_name
     FROM transactions t LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.reviewed = 0 ORDER BY t.date DESC LIMIT 10`
  );
}

export function markTransactionReviewed(id: string): void {
  getDb().runSync('UPDATE transactions SET reviewed = 1 WHERE id = ?', id);
}

export type BudgetWithCategory = {
  category_id: string;
  category_name: string;
  emoji: string;
  spent: number;
  budget: number;
  over: number;
};

export function getBudgetsForDashboard(): BudgetWithCategory[] {
  const db = getDb();
  return db.getAllSync<BudgetWithCategory>(
    `SELECT b.category_id, c.name as category_name, c.emoji, b.spent, b.budget,
            (b.spent - b.budget) as over
     FROM budgets b JOIN categories c ON b.category_id = c.id
     WHERE b.month = ? AND c.parent_id IS NULL
     ORDER BY b.spent DESC`,
    MONTH
  );
}

export type CategoryGroup = {
  id: string;
  name: string;
  emoji: string;
  dot_color: string;
  items: { id: string; name: string; emoji: string; spent: number; budget: number }[];
};

export function getCategoriesWithBudgets(): CategoryGroup[] {
  const db = getDb();
  const parents = db.getAllSync<{ id: string; name: string; emoji: string; dot_color: string }>(
    `SELECT id, name, emoji, dot_color FROM categories WHERE parent_id IS NULL ORDER BY id`
  );
  return parents.map((p) => {
    const items = db.getAllSync<{ id: string; name: string; emoji: string; spent: number; budget: number }>(
      `SELECT c.id, c.name, c.emoji, COALESCE(b.spent,0) as spent, COALESCE(b.budget,0) as budget
       FROM categories c LEFT JOIN budgets b ON c.id = b.category_id AND b.month = ?
       WHERE c.parent_id = ?`,
      MONTH,
      p.id
    );
    return { ...p, items };
  });
}

export type RecurringRow = {
  id: string;
  name: string;
  amount: number;
  due_day: number;
  icon: string | null;
  paid: number;
  month: string;
};

export function getRecurringsForMonth(): RecurringRow[] {
  const db = getDb();
  return db.getAllSync<RecurringRow>(
    `SELECT id, name, amount, due_day, icon, paid, month FROM recurrings WHERE month = ? ORDER BY due_day`,
    MONTH
  );
}

export type GoalRow = {
  id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  target_date: string | null;
  status: string;
};

export function getGoalsActive(): GoalRow[] {
  const db = getDb();
  return db.getAllSync<GoalRow>(
    `SELECT id, name, target_amount, saved_amount, target_date, status FROM goals WHERE status = 'active' ORDER BY id`
  );
}

export function getGoalsReady(): GoalRow[] {
  const db = getDb();
  return db.getAllSync<GoalRow>(
    `SELECT id, name, target_amount, saved_amount, target_date, status FROM goals WHERE status = 'ready' ORDER BY id`
  );
}

export function getGoalsSummary(): { saved: number; toGo: number } {
  const db = getDb();
  const savedRow = db.getFirstSync<{ saved: number }>(
    `SELECT SUM(saved_amount) as saved FROM goals WHERE status = 'active'`
  );
  const toGoRow = db.getFirstSync<{ to_go: number }>(
    `SELECT SUM(target_amount - saved_amount) as to_go FROM goals WHERE status = 'active'`
  );
  return { saved: savedRow?.saved ?? 0, toGo: toGoRow?.to_go ?? 0 };
}

export function getRecurringsSummary(): { leftToPay: number; paidSoFar: number } {
  const db = getDb();
  const unpaid = db.getFirstSync<{ sum_amount: number }>(
    `SELECT SUM(amount) as sum_amount FROM recurrings WHERE month = ? AND paid = 0`,
    MONTH
  );
  const paid = db.getFirstSync<{ sum_amount: number }>(
    `SELECT SUM(amount) as sum_amount FROM recurrings WHERE month = ? AND paid = 1`,
    MONTH
  );
  return {
    leftToPay: unpaid?.sum_amount ?? 0,
    paidSoFar: paid?.sum_amount ?? 0,
  };
}
