import type { Config } from "drizzle-kit";

export default {
    dialect: "sqlite",
    schema: "./src/lib/db/schema-main.ts",
    out: "./drizzle/main",
    dbCredentials: { url: "./prisma/main.db" },
} satisfies Config;
