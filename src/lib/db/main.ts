// maintainer: richie-rich90454 · June 2026
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/main';

const globalForPrisma = globalThis as unknown as { prismaMain: PrismaClient };

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL_MAIN ?? 'file:./prisma/main.db',
});

export const mainDb = globalForPrisma.prismaMain || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMain = mainDb;