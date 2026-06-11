import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';

interface StripeWebhookBody {
  type?: string;
  data?: {
    object?: {
      metadata?: {
        tid?: string;
      };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const webhook = searchParams.get('webhook');

    if (webhook !== null) {
      return handleWebhook(req);
    }

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

    // Stripe stub: create a payments record as pending
    const tid = 'STRIPE-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
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

    await webDb.users.update({
      where: { ID: user.ID },
      data: {
        membership: planId,
        expire: now + 30 * 24 * 60 * 60,
      },
    });

    return NextResponse.json({
      status: 'pending',
      message: 'Stripe checkout session created. Complete payment on Stripe.',
      tid: tid,
      checkout_url: `https://checkout.stripe.com/pay/stub_${tid}`,
    });
  } catch (error) {
    console.error('Stripe POST error:', error);
    return NextResponse.json({ error: 'Failed to create Stripe checkout session.' }, { status: 500 });
  }
}

async function handleWebhook(req: NextRequest) {
  try {
    const signature = req.headers.get('stripe-signature');

    let body: StripeWebhookBody;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    console.log('Stripe webhook received:', body.type || 'unknown event');

    // Stub: mark payment as completed if checkout.session.completed
    if (body.type === 'checkout.session.completed' && body.data?.object?.metadata?.tid) {
      const tid = body.data.object.metadata.tid;

      const payment = await webDb.payments.findFirst({ where: { tid } });
      if (payment) {
        const now = Math.floor(Date.now() / 1000);
        await webDb.users.update({
          where: { ID: payment.user },
          data: {
            membership: payment.plan,
            expire: now + 30 * 24 * 60 * 60,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
}