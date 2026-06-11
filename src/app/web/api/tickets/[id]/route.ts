import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getWebSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const ticketId = parseInt(id, 10);

    const ticket = await webDb.tickets.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const messages = await webDb.messages.findMany({
      where: { ticketid: ticket.id },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ ticket, messages });
  } catch (error) {
    console.error('Ticket detail GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getWebSession();
    if (!session.userId) {
      return NextResponse.redirect(new URL('/web/login', req.url));
    }

    const user = await webDb.users.findUnique({
      where: { ID: session.userId },
      select: { username: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const ticketId = parseInt(id, 10);

    const ticket = await webDb.tickets.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    if (ticket.status === 'Closed') {
      return NextResponse.json({ error: 'Ticket is closed' }, { status: 400 });
    }

    const formData = await req.formData();
    const content = (formData.get('content') as string)?.trim();

    if (!content) {
      return NextResponse.json({ error: 'Reply content is required.' }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);

    await webDb.messages.create({
      data: {
        ticketid: ticket.id,
        content,
        sender: user.username,
        date: now,
      },
    });

    // Update ticket status to show customer replied
    await webDb.tickets.update({
      where: { id: ticket.id },
      data: { status: 'Waiting for admin response' },
    });

    return NextResponse.json({ success: 'Reply sent successfully' });
  } catch (error) {
    console.error('Ticket reply POST error:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}