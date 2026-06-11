// maintainer: richie-rich90454 · June 2026
import { PrismaClient } from './generated/main';

const globalForPrisma = globalThis as unknown as { prismaMain: PrismaClient };

export const mainDb = globalForPrisma.prismaMain || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMain = mainDb;