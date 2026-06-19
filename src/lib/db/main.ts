// maintainer: richie-rich90454 · June 2026
import 'dotenv/config';
import { isAbsolute, resolve } from 'node:path';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/main';

const globalForPrisma = globalThis as unknown as { prismaMain: PrismaClient };

function absoluteDbPath(envKey: string, fallback: string): string {
    const raw = (process.env[envKey] ?? fallback).replace(/^file:/, '');
    return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
}

const adapter = new PrismaBetterSqlite3({
    url: absoluteDbPath('DATABASE_URL_MAIN', 'prisma/main.db'),
});

export const mainDb = globalForPrisma.prismaMain || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMain = mainDb;
