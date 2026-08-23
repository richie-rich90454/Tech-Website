import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Mirrors prisma/schema-main.prisma. Column/property names match the Prisma
// fields exactly so the Prisma-compatible query layer (prisma-shim) and all
// existing call sites keep working unchanged.
export const submission = sqliteTable('submission', {
    id: integer('id').primaryKey(),
    techname: text('techname').notNull().default(''),
    tl1_desc: text('tl1_desc').notNull().default(''),
    tl2_desc: text('tl2_desc').notNull().default(''),
    tl3_desc: text('tl3_desc').notNull().default(''),
    tl4_desc: text('tl4_desc').notNull().default(''),
    link: text('link').notNull().default(''),
    displaytext: text('displaytext').notNull().default(''),
    accepted: integer('', { mode: 'boolean' }).notNull().default(false),
    username: text('username').notNull().default(''),
    contact: text('contact').notNull().default(''),
});

export const domains = sqliteTable('domains', {
    id: integer('id').primaryKey(),
    R: integer('', { mode: 'boolean' }).notNull().default(false),
    TP: integer('', { mode: 'boolean' }).notNull().default(false),
    MT: integer('', { mode: 'boolean' }).notNull().default(false),
    AR: integer('', { mode: 'boolean' }).notNull().default(false),
    U: integer('', { mode: 'boolean' }).notNull().default(false),
    MDL: integer('', { mode: 'boolean' }).notNull().default(false),
    RA: integer('', { mode: 'boolean' }).notNull().default(false),
    RoTech: integer('', { mode: 'boolean' }).notNull().default(false),
    LS: integer('', { mode: 'boolean' }).notNull().default(false),
    RoThink: integer('', { mode: 'boolean' }).notNull().default(false),
    EoST: integer('', { mode: 'boolean' }).notNull().default(false),
    EF: integer('', { mode: 'boolean' }).notNull().default(false),
    RTE: integer('', { mode: 'boolean' }).notNull().default(false),
    DLoI: integer('', { mode: 'boolean' }).notNull().default(false),
    RaAoC: integer('', { mode: 'boolean' }).notNull().default(false),
});

export const login = sqliteTable('login', {
    User: text('User').primaryKey(),
    PW: text('PW').notNull().default(''),
});
