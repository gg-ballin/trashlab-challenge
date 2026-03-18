import type { SQLiteDatabase } from 'expo-sqlite';

const MONTH = 'Nov';

const categoriesRows: Array<{ id: string; name: string; parent_id: string | null; emoji: string; dot_color: string }> = [
  { id: '1', name: 'Home', parent_id: null, emoji: '🏠', dot_color: '#FF9500' },
  { id: '1-1', name: 'Rent', parent_id: '1', emoji: '🔑', dot_color: '#FF9500' },
  { id: '1-2', name: 'Utilities', parent_id: '1', emoji: '🏠', dot_color: '#FF9500' },
  { id: '2', name: 'Car & Transportation', parent_id: null, emoji: '🚗', dot_color: '#5AC8FA' },
  { id: '2-1', name: 'Car', parent_id: '2', emoji: '🚗', dot_color: '#5AC8FA' },
  { id: '2-2', name: 'Bus', parent_id: '2', emoji: '🚌', dot_color: '#5AC8FA' },
  { id: '3', name: 'Food & Drink', parent_id: null, emoji: '🍔', dot_color: '#AF52DE' },
  { id: '3-1', name: 'Groceries', parent_id: '3', emoji: '🥑', dot_color: '#AF52DE' },
  { id: '3-2', name: 'Restaurants', parent_id: '3', emoji: '🍔', dot_color: '#AF52DE' },
  { id: '4', name: 'Shopping', parent_id: null, emoji: '🛍️', dot_color: '#FF3B30' },
  { id: '4-1', name: 'Clothing', parent_id: '4', emoji: '👕', dot_color: '#FF3B30' },
  { id: '4-2', name: 'Shops', parent_id: '4', emoji: '🛍️', dot_color: '#FF3B30' },
  { id: '5', name: 'Subscriptions', parent_id: null, emoji: '📱', dot_color: '#34C759' },
  { id: '6', name: 'Entertainment', parent_id: null, emoji: '🎬', dot_color: '#FF9500' },
];

const budgetsRows: Array<{ category_id: string; month: string; spent: number; budget: number }> = [
  { category_id: '1', month: MONTH, spent: 2022, budget: 2050 },
  { category_id: '1-1', month: MONTH, spent: 1984, budget: 2000 },
  { category_id: '1-2', month: MONTH, spent: 38, budget: 50 },
  { category_id: '2', month: MONTH, spent: 1221, budget: 970 },
  { category_id: '2-1', month: MONTH, spent: 927, budget: 850 },
  { category_id: '2-2', month: MONTH, spent: 295, budget: 120 },
  { category_id: '3', month: MONTH, spent: 308, budget: 450 },
  { category_id: '3-1', month: MONTH, spent: 281, budget: 250 },
  { category_id: '3-2', month: MONTH, spent: 27, budget: 200 },
  { category_id: '4', month: MONTH, spent: 161, budget: 250 },
  { category_id: '4-1', month: MONTH, spent: 146, budget: 150 },
  { category_id: '4-2', month: MONTH, spent: 15, budget: 100 },
  { category_id: '5', month: MONTH, spent: 35, budget: 100 },
  { category_id: '6', month: MONTH, spent: 27, budget: 200 },
];

const transactionsRows: Array<{
  id: string;
  date: string;
  name: string;
  identifier: string;
  tier: string;
  amount: number;
  category_id: string | null;
  reviewed: number;
}> = [
  { id: '1', date: 'Jun 16, 2025', name: 'DELTA AIR LINES ATLANTA', identifier: '11000', tier: 'Platinum', amount: 286.97, category_id: null, reviewed: 0 },
  { id: '2', date: 'Jun 12, 2025', name: 'DELTA AIR LINES ATLANTA', identifier: '11000', tier: 'Platinum', amount: 35.0, category_id: null, reviewed: 0 },
  { id: '3', date: 'Jun 11, 2025', name: 'DELTA AIR LINES ATLANTA', identifier: '11000', tier: 'Platinum', amount: 348.49, category_id: null, reviewed: 0 },
  { id: '4', date: 'Jun 3, 2025', name: 'DELTA AIR LINES ATLANTA', identifier: '11000', tier: 'Platinum', amount: 241.18, category_id: null, reviewed: 0 },
  { id: '5', date: 'May 28, 2025', name: 'DELTA AIR LINES ATLANTA', identifier: '11000', tier: 'Platinum', amount: 278.48, category_id: null, reviewed: 0 },
  { id: '6', date: 'Today', name: 'Urban Outfitters', identifier: '', tier: '', amount: 93.42, category_id: '4-1', reviewed: 0 },
];

const goalsRows: Array<{
  id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  target_date: string | null;
  status: string;
}> = [
  { id: '1', name: 'New Car', target_amount: 10000, saved_amount: 7030, target_date: 'May 2026', status: 'active' },
  { id: '2', name: 'Emergency Fund', target_amount: 10000, saved_amount: 7000, target_date: null, status: 'active' },
  { id: '3', name: 'Japan Trip', target_amount: 3000, saved_amount: 735, target_date: 'Nov 2026', status: 'active' },
  { id: '4', name: 'Wedding Fund', target_amount: 5000, saved_amount: 0, target_date: null, status: 'ready' },
];

const recurringsRows: Array<{
  id: string;
  name: string;
  amount: number;
  due_day: number;
  icon: string | null;
  paid: number;
  month: string;
}> = [
  { id: '1', name: 'Spotify', amount: 9.99, due_day: 1, icon: 'musical-notes', paid: 1, month: MONTH },
  { id: '2', name: 'Property Payment Rent Ca', amount: 1984, due_day: 4, icon: 'home', paid: 1, month: MONTH },
  { id: '3', name: 'Car Payment', amount: 420, due_day: 5, icon: 'car', paid: 1, month: MONTH },
  { id: '4', name: 'Namecheap', amount: 14.99, due_day: 8, icon: 'globe-outline', paid: 1, month: MONTH },
  { id: '5', name: 'Rayne Water Ca', amount: 85, due_day: 12, icon: 'water-outline', paid: 1, month: MONTH },
  { id: '6', name: 'Lemonade Insurance', amount: 25, due_day: 15, icon: 'shield-checkmark', paid: 1, month: MONTH },
  { id: '7', name: 'Audible', amount: 14.95, due_day: 18, icon: 'book-outline', paid: 0, month: MONTH },
  { id: '8', name: 'Hulu', amount: 12.99, due_day: 22, icon: 'tv-outline', paid: 0, month: MONTH },
  { id: '9', name: 'Netflix', amount: 15.99, due_day: 28, icon: 'tv-outline', paid: 0, month: MONTH },
];

const receiptsRows: Array<{ id: string; merchant_name: string; date: string; amount: number }> = [
  { id: '1', merchant_name: "The Starling Atlanta...", date: 'Apr 4, 2025', amount: 61.13 },
  { id: '2', merchant_name: "Yvonne's", date: 'Feb 28, 2024', amount: 179.98 },
  { id: '3', merchant_name: 'Atlanta Airport Market', date: 'Apr 3, 2025', amount: 7.45 },
  { id: '4', merchant_name: 'Bordine Nursery', date: 'Mar 15, 2025', amount: 200.11 },
];

const businessSpendingRows: Array<{ id: string; name: string; icon: string; spend: number; rewards: number; rate: number }> = [
  { id: '1', name: 'Rent & Utilities', icon: '🏢', spend: 232.25, rewards: 2.32, rate: 1.0 },
  { id: '2', name: 'Office Supplies & Equipment', icon: '📎', spend: 73.51, rewards: 4.41, rate: 6.0 },
  { id: '3', name: 'Software & Technology Subsc...', icon: '💻', spend: 29.94, rewards: 1.15, rate: 3.8 },
  { id: '4', name: 'Marketing & Advertising', icon: '📢', spend: 1021.0, rewards: 10.86, rate: 1.1 },
  { id: '5', name: 'Travel & Transportation', icon: '✈️', spend: 100.62, rewards: 1.8, rate: 1.8 },
  { id: '6', name: 'Inventory & Materials', icon: '📦', spend: 240.7, rewards: 11.11, rate: 4.6 },
  { id: '7', name: 'Insurance', icon: '🛡️', spend: 80.46, rewards: 0.8, rate: 1.0 },
  { id: '8', name: 'Meals & Entertainment', icon: '🍴', spend: 7.7, rewards: 0.08, rate: 1.0 },
  { id: '9', name: 'Repairs & Maintenance', icon: '🔧', spend: 250.0, rewards: 2.5, rate: 1.0 },
  { id: '10', name: 'Other Business Expenses', icon: '📄', spend: 85.42, rewards: 0.85, rate: 1.0 },
];

export function seedDatabase(db: SQLiteDatabase): void {
  for (const row of categoriesRows) {
    db.runSync(
      'INSERT OR IGNORE INTO categories (id, name, parent_id, emoji, dot_color) VALUES (?, ?, ?, ?, ?)',
      row.id,
      row.name,
      row.parent_id,
      row.emoji,
      row.dot_color
    );
  }
  for (const row of budgetsRows) {
    db.runSync(
      'INSERT OR IGNORE INTO budgets (category_id, month, spent, budget) VALUES (?, ?, ?, ?)',
      row.category_id,
      row.month,
      row.spent,
      row.budget
    );
  }
  for (const row of transactionsRows) {
    db.runSync(
      'INSERT OR IGNORE INTO transactions (id, date, name, identifier, tier, amount, category_id, reviewed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      row.id,
      row.date,
      row.name,
      row.identifier,
      row.tier,
      row.amount,
      row.category_id,
      row.reviewed
    );
  }
  for (const row of receiptsRows) {
    db.runSync(
      'INSERT OR IGNORE INTO receipts (id, merchant_name, date, amount) VALUES (?, ?, ?, ?)',
      row.id,
      row.merchant_name,
      row.date,
      row.amount
    );
  }
  for (const row of businessSpendingRows) {
    db.runSync(
      'INSERT OR IGNORE INTO business_spending (id, name, icon, spend, rewards, rate) VALUES (?, ?, ?, ?, ?, ?)',
      row.id,
      row.name,
      row.icon,
      row.spend,
      row.rewards,
      row.rate
    );
  }
  for (const row of goalsRows) {
    db.runSync(
      'INSERT OR IGNORE INTO goals (id, name, target_amount, saved_amount, target_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      row.id,
      row.name,
      row.target_amount,
      row.saved_amount,
      row.target_date,
      row.status
    );
  }
  for (const row of recurringsRows) {
    db.runSync(
      'INSERT OR IGNORE INTO recurrings (id, name, amount, due_day, icon, paid, month) VALUES (?, ?, ?, ?, ?, ?, ?)',
      row.id,
      row.name,
      row.amount,
      row.due_day,
      row.icon,
      row.paid,
      row.month
    );
  }
  db.runSync('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)', 'seeded', '1');
}
