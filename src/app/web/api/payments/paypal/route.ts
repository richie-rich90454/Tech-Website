import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';

export async function POST(req: NextRequest) {
  try {
    const session = await getWebSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const user = await webDb.users.findUnique({
      where: { ID: session.userId },
      select: { ID: true, username: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const formData = await req.formData();
    const planId = parseInt((formData.get('plan') as string) || '0', 10);
    const email = (formData.get('email') as string)?.trim();
    const amount = parseFloat((formData.get('amount') as string) || '0');

    if (!planId || isNaN(planId) || planId <= 0) {
      return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // PayPal stub: create a payments record as pending
    const tid = 'PAYPAL-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = Math.floor(Date.now() / 1000);

    await webDb.payments.create({
      data: {
        paid: amount,
        plan: planId,
        user: user.ID,
        email: email,
        tid: tid,
        date: now,
      },
    });

    // Activate membership for the user (stub behavior)
    await webDb.users.update({
      where: { ID: user.ID },
      data: {
        membership: planId,
        expire: now + 30 * 24 * 60 * 60, // 30 days from now
      },
    });

    return NextResponse.json({
      status: 'pending',
      message: 'PayPal payment intent created. Please complete payment via PayPal.',
      tid: tid,
      redirect: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=stub@example.com&item_name=Plan+${planId}&amount=${amount}&currency=USD`,
    });
  } catch (error) {
    console.error('PayPal POST error:', error);
    return NextResponse.json({ error: 'Failed to create PayPal payment.' }, { status: 500 });
  }
}