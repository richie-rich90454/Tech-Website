import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';

export async function GET() {
  try {
    const session = await getWebSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await webDb.users.findUnique({
      where: { ID: session.userId },
      select: { username: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tickets = await webDb.tickets.findMany({
      where: { username: user.username },
      select: { id: true, subject: true, status: true, date: true },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Tickets GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getWebSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await webDb.users.findUnique({
      where: { ID: session.userId },
      select: { username: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const subject = (formData.get('subject') as string)?.trim();
    const content = (formData.get('content') as string)?.trim();

    if (!subject || !content) {
      return NextResponse.json({ error: 'Subject and content are required.' }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);

    const ticket = await webDb.tickets.create({
      data: {
        subject,
        content,
        status: 'Waiting for admin response',
        username: user.username,
        date: now,
      },
    });

    return NextResponse.json({ success: 'Ticket created successfully', id: ticket.id });
  } catch (error) {
    console.error('Ticket POST error:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}