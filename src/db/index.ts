import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL } from './schema';
import { seedDatabase, seedRecurringsIfEmpty, seedGoalsIfEmpty } from './seed';

const DB_NAME = 'trashlab.db';

let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync(DB_NAME);
  }
  return db;
}

export function initDb(): SQLite.SQLiteDatabase {
  const database = getDb();
  for (const sql of SCHEMA_SQL) {
    database.execSync(sql);
  }
  const row = database.getFirstSync<{ value: string }>("SELECT value FROM meta WHERE key = ?", 'seeded');
  if (!row?.value) {
    seedDatabase(database);
  } else {
    seedRecurringsIfEmpty(database);
    seedGoalsIfEmpty(database);
  }
  return database;
}
