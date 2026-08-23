import type { Config } from 'drizzle-kit';

export default {
    dialect: 'sqlite',
    schema: './src/lib/db/schema-web.ts',
    out: './drizzle/web',
    dbCredentials: { url: './prisma/web.db' },
} satisfies Config;
