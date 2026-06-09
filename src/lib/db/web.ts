import { PrismaClient } from './generated/web';

const globalForPrisma = globalThis as unknown as { prismaWeb: PrismaClient };

export const webDb = globalForPrisma.prismaWeb || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaWeb = webDb;