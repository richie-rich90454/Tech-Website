import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 20;

  const [logs, total] = await Promise.all([
    webDb.logs.findMany({
      orderBy: { date: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    webDb.logs.count(),
  ]);

  return NextResponse.json({ logs, total, page, totalPages: Math.ceil(total / perPage) });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const action = formData.get('action') as string;

  if (action === 'stop') {
    const id = parseInt(formData.get('id') as string);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid log ID' }, { status: 400 });
    }
    await webDb.logs.update({ where: { id }, data: { stopped: 1 } });
    return NextResponse.redirect(new URL('/web/admin/attacklogs', req.url));
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}