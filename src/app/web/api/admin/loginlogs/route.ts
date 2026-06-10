import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 20;

  const [logs, total] = await Promise.all([
    webDb.loginlogs.findMany({
      orderBy: { date: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    webDb.loginlogs.count(),
  ]);

  return NextResponse.json({ logs, total, page, totalPages: Math.ceil(total / perPage) });
}