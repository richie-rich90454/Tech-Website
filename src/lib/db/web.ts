import 'dotenv/config';
import { isAbsolute, resolve } from 'node:path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/web';

const globalForPrisma = globalThis as unknown as { prismaWeb: PrismaClient };

function absoluteDbPath(envKey: string, fallback: string): string {
    const raw = (process.env[envKey] ?? fallback).replace(/^file:/, '');
    return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
}

const adapter = new PrismaBetterSqlite3({
    url: absoluteDbPath('DATABASE_URL_WEB', 'prisma/web.db'),
});

export const webDb = globalForPrisma.prismaWeb || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaWeb = webDb;
