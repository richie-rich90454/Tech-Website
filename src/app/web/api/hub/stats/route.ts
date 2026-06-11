import { NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET(): Promise<NextResponse> {
  try {
    const now = Math.floor(Date.now() / 1000);

    const runningAttacks = await webDb.logs.findMany({
      where: {
        stopped: 0,
        time: { gt: 0 },
      },
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
      take: 50,
    });

    return NextResponse.json({ runningAttacks });
  } catch (error) {
    console.error('Hub stats GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch hub stats' }, { status: 500 });
  }
}