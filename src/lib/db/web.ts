import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { isAbsolute, resolve } from "node:path";
import * as schema from "./schema-web";
import { createModel } from "./prisma-shim";

function absoluteDbPath(envKey: string, fallback: string): string {
    const raw = (process.env[envKey] ?? fallback).replace(/^file:/, "");
    return isAbsolute(raw) ? raw : resolve(process.cwd(), raw);
}

const sqlite = new Database(absoluteDbPath("DATABASE_URL_WEB", "prisma/web.db"));
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite, { schema });

export const webDb = {
    twoauthsettings: createModel(db, schema.twoauthsettings, { pk: "secret" }),
    actions: createModel(db, schema.actions, { pk: "id" }),
    affiliateWithdraws: createModel(db, schema.affiliateWithdraws, { pk: "ID" }),
    api: createModel(db, schema.api, { pk: "id" }),
    bans: createModel(db, schema.bans, { pk: "username" }),
    blacklist: createModel(db, schema.blacklist, { pk: "ID" }),
    cark: createModel(db, schema.cark, { pk: "id" }),
    faq: createModel(db, schema.faq, { pk: "id" }),
    fe: createModel(db, schema.fe, { pk: "ID" }),
    giftcards: createModel(db, schema.giftcards, { pk: "ID" }),
    iplogs: createModel(db, schema.iplogs, { pk: "ID" }),
    loginlogs: createModel(db, schema.loginlogs, { pk: "id" }),
    logs: createModel(db, schema.logs, { pk: "id" }),
    messages: createModel(db, schema.messages, { pk: "messageid" }),
    methods: createModel(db, schema.methods, { pk: "id" }),
    news: createModel(db, schema.news, { pk: "ID" }),
    payments: createModel(db, schema.payments, { pk: "ID" }),
    ping_sessions: createModel(db, schema.ping_sessions, { pk: "ID" }),
    plans: createModel(db, schema.plans, { pk: "ID" }),
    reports: createModel(db, schema.reports, { pk: "id" }),
    servers: createModel(db, schema.servers, { pk: "id" }),
    settings: createModel(db, schema.settings, { pk: "sitename" }),
    smtpsettings: createModel(db, schema.smtpsettings, { pk: "host" }),
    tickets: createModel(db, schema.tickets, { pk: "id" }),
    users: createModel(db, schema.users, { pk: "ID" }),
    $disconnect: async () => sqlite.close(),
};

export type WebDb = typeof webDb;
