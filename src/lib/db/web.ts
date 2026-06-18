import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from './generated/web';

const globalForPrisma = globalThis as unknown as { prismaWeb: PrismaClient };

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL_WEB ?? 'file:./prisma/web.db',
});

export const webDb = globalForPrisma.prismaWeb || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaWeb = webDb;