export const SCHEMA_SQL = [
  `CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT
  );`,
  `CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    emoji TEXT,
    dot_color TEXT,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
  );`,
  `CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id TEXT NOT NULL,
    month TEXT NOT NULL,
    spent REAL NOT NULL DEFAULT 0,
    budget REAL NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );`,
  `CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    name TEXT NOT NULL,
    identifier TEXT,
    tier TEXT,
    amount REAL NOT NULL,
    category_id TEXT,
    reviewed INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );`,
  `CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY,
    merchant_name TEXT NOT NULL,
    date TEXT NOT NULL,
    amount REAL NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS business_spending (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    spend REAL NOT NULL,
    rewards REAL NOT NULL,
    rate REAL NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS goals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    saved_amount REAL NOT NULL DEFAULT 0,
    target_date TEXT,
    status TEXT NOT NULL DEFAULT 'active'
  );`,
  `CREATE TABLE IF NOT EXISTS recurrings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    due_day INTEGER NOT NULL,
    icon TEXT,
    paid INTEGER NOT NULL DEFAULT 0,
    month TEXT NOT NULL
  );`,
];
