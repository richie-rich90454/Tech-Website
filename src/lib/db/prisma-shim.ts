import {
    and,
    asc,
    desc,
    eq,
    gt,
    gte,
    inArray,
    like,
    lt,
    lte,
    ne,
    count as dcount,
    sum as dsum,
} from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

type Db = BetterSQLite3Database<any>;
type Where = Record<string, any> | undefined;
type OrderBy = Record<string, 'asc' | 'desc'> | undefined;
type Select = Record<string, boolean> | undefined;

function columnFor(table: any, field: string) {
    const col = table[field];
    if (!col) throw new Error('Unknown column: ' + field);
    return col;
}

function buildWhere(table: any, where?: Where) {
    if (!where || Object.keys(where).length === 0) return undefined;
    const conds = Object.entries(where).map(([field, cond]) => {
        const col = columnFor(table, field);
        if (cond !== null && typeof cond === 'object' && !(cond instanceof Date)) {
            const inner = Object.entries(cond).map(([op, val]) => {
                switch (op) {
                    case 'not':
                        return ne(col, val);
                    case 'gt':
                        return gt(col, val);
                    case 'gte':
                        return gte(col, val);
                    case 'lt':
                        return lt(col, val);
                    case 'lte':
                        return lte(col, val);
                    case 'contains':
                        return like(col, '%' + String(val) + '%');
                    case 'in':
                        return Array.isArray(val) ? inArray(col, val) : eq(col, val);
                    default:
                        return eq(col, val);
                }
            });
            return and(...inner);
        }
        return eq(col, cond);
    });
    return and(...conds);
}

function buildOrderBy(table: any, orderBy?: OrderBy) {
    if (!orderBy) return undefined;
    return Object.entries(orderBy).map(([field, dir]) =>
        dir === 'desc' ? desc(columnFor(table, field)) : asc(columnFor(table, field))
    );
}

function buildSelect(table: any, select?: Select) {
    if (!select) return undefined;
    const out: Record<string, any> = {};
    for (const key of Object.keys(select)) out[key] = columnFor(table, key);
    return out;
}

export interface ModelOptions {
    pk?: string;
}

export function createModel(db: Db, table: any, opts: ModelOptions = {}) {
    const pk = opts.pk;
    return {
        async findUnique(args: any = {}): Promise<any> {
            const sel = buildSelect(table, args.select);
            let q: any = sel ? db.select(sel).from(table) : db.select().from(table);
            const w = buildWhere(table, args.where);
            if (w) q = q.where(w);
            const ob = buildOrderBy(table, args.orderBy);
            if (ob) q = q.orderBy(...ob);
            return q.get();
        },
        async findFirst(args: any = {}): Promise<any> {
            const sel = buildSelect(table, args.select);
            let q: any = sel ? db.select(sel).from(table) : db.select().from(table);
            const w = buildWhere(table, args.where);
            if (w) q = q.where(w);
            const ob = buildOrderBy(table, args.orderBy);
            if (ob) q = q.orderBy(...ob);
            return q.get();
        },
        async findMany(args: any = {}): Promise<any[]> {
            const sel = buildSelect(table, args.select);
            let q: any = sel ? db.select(sel).from(table) : db.select().from(table);
            const w = buildWhere(table, args.where);
            if (w) q = q.where(w);
            const ob = buildOrderBy(table, args.orderBy);
            if (ob) q = q.orderBy(...ob);
            if (typeof args.take === 'number') q = q.limit(args.take);
            if (typeof args.skip === 'number') q = q.offset(args.skip);
            return q.all();
        },
        async create(args: { data: any }): Promise<any> {
            const res = db.insert(table).values(args.data).run();
            if (pk) {
                const pkVal = args.data[pk];
                const lookup = pkVal !== undefined ? pkVal : Number(res.lastInsertRowid);
                const row = db
                    .select()
                    .from(table)
                    .where(eq(columnFor(table, pk), lookup))
                    .get();
                if (row) return row;
            }
            return args.data;
        },
        async update(args: { where: Where; data: any }): Promise<any> {
            const w = buildWhere(table, args.where);
            db.update(table)
                .set(args.data)
                .where(w as any)
                .run();
            const row = db
                .select()
                .from(table)
                .where(w as any)
                .get();
            return row ?? args.data;
        },
        async delete(args: { where: Where }): Promise<any> {
            const w = buildWhere(table, args.where);
            db.delete(table)
                .where(w as any)
                .run();
        },
        async deleteMany(args: { where?: Where } = {}): Promise<any> {
            const w = buildWhere(table, args.where);
            db.delete(table)
                .where(w as any)
                .run();
        },
        async count(args: { where?: Where } = {}): Promise<any> {
            const w = buildWhere(table, args.where);
            let q: any = db.select({ value: dcount() }).from(table);
            if (w) q = q.where(w);
            const r = q.get();
            return r?.value ?? 0;
        },
        async aggregate(args: { _sum: Record<string, boolean> }): Promise<any> {
            const field = Object.keys(args._sum)[0];
            const col = columnFor(table, field);
            const q = db.select({ sum: dsum(col) }).from(table);
            const r = q.get();
            return { _sum: { [field]: Number(r?.sum ?? 0) } };
        },
        async upsert(args: { where: Where; update: any; create: any }): Promise<any> {
            const w = buildWhere(table, args.where);
            const existing = db
                .select()
                .from(table)
                .where(w as any)
                .get();
            if (existing) {
                if (args.update && Object.keys(args.update).length > 0) {
                    db.update(table)
                        .set(args.update)
                        .where(w as any)
                        .run();
                }
                return db
                    .select()
                    .from(table)
                    .where(w as any)
                    .get();
            }
            const res = db.insert(table).values(args.create).run();
            if (pk) {
                const pkVal = args.create[pk];
                const lookup = pkVal !== undefined ? pkVal : Number(res.lastInsertRowid);
                return (
                    db
                        .select()
                        .from(table)
                        .where(eq(columnFor(table, pk), lookup))
                        .get() ?? args.create
                );
            }
            return args.create;
        },
    };
}
