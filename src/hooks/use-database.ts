import { getDb } from "@/db";


export function useDatabase() {
  return { db: getDb() };
}
