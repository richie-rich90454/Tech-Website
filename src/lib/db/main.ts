import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { isAbsolute, resolve } from 'node:path';
import 'dotenv/config';
import * as schema from './schema-main';
import { createModel } from './prisma-shim';

function absoluteDbPath(envKey: string, fallback: string): string {
    const raw = (process.env[envKey] ?? fallback).replace(/^file:/, '');
    return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
}

const sqlite = new Database(absoluteDbPath('DATABASE_URL_MAIN', 'prisma/main.db'));
sqlite.pragma('journal_mode = WAL');
const db = drizzle(sqlite, { schema });

export const mainDb = {
    submission: createModel(db, schema.submission, { pk: 'id' }),
    domains: createModel(db, schema.domains, { pk: 'id' }),
    login: createModel(db, schema.login, { pk: 'User' }),
    $disconnect: async () => sqlite.close(),
};

export type MainDb = typeof mainDb;
