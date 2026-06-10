import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 20;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [tickets, total] = await Promise.all([
    webDb.tickets.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    webDb.tickets.count({ where }),
  ]);

  return NextResponse.json({ tickets, total, page, totalPages: Math.ceil(total / perPage) });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const action = formData.get('action') as string;
  const id = parseInt(formData.get('id') as string);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 });
  }

  if (action === 'reply') {
    const content = formData.get('content') as string;
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    await webDb.messages.create({
      data: {
        ticketid: id,
        content,
        sender: 'Admin',
        date: Math.floor(Date.now() / 1000),
      },
    });

    await webDb.tickets.update({
      where: { id },
      data: { status: 'Waiting for user response' },
    });

    return NextResponse.redirect(new URL(`/web/admin/tickets/${id}`, req.url));
  }

  if (action === 'close') {
    await webDb.tickets.update({
      where: { id },
      data: { status: 'Closed' },
    });
    return NextResponse.redirect(new URL('/web/admin/tickets', req.url));
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}