import { PrismaClient } from './generated/prisma/client';
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const DB_URL = process.env.DATABASE_URL;
if (DB_URL === undefined) throw "DATABASE_URL environment variable was not specified!";

export const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: DB_URL })
});

export function simplePlural(text: string, count: number) {
  if (count === 1) return text;
  else return text + 's';
}