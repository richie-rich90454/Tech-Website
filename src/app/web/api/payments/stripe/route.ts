import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';
import { features } from '@/config/features';

async function stripeClient(): Promise<Stripe | null> {
    const key =
        process.env.STRIPE_SECRET_KEY ||
        (await webDb.settings.findFirst({ select: { stripeSecretKey: true } }))?.stripeSecretKey;
    return key ? new Stripe(key) : null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        if (!features.payments) {
            return NextResponse.json({ error: 'Payments are disabled.' }, { status: 403 });
        }

        const session = await getWebSession();
        if (!session.userId) {
            return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
        }

        const stripe = await stripeClient();
        if (!stripe) {
            return NextResponse.json(
                { error: 'Stripe is not configured on this server.' },
                { status: 503 }
            );
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

        if (!planId || isNaN(planId) || planId <= 0) {
            return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
        }
        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        // Price ALWAYS comes from our own plans table, never the client.
        const plan = await webDb.plans.findUnique({ where: { ID: planId } });
        if (!plan || plan.price <= 0) {
            return NextResponse.json({ error: 'Plan not found.' }, { status: 404 });
        }

        const tid =
            'STRIPE-' +
            Date.now().toString(36).toUpperCase() +
            '-' +
            Math.random().toString(36).substring(2, 8).toUpperCase();

        const checkout = await stripe.checkout.sessions.create({
            mode: 'payment',
            customer_email: email,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: 'usd',
                        unit_amount: Math.round(plan.price * 100),
                        product_data: { name: `${plan.name} membership` },
                    },
                },
            ],
            metadata: { tid, userId: String(user.ID), planId: String(plan.ID) },
            success_url: new URL('/web/dashboard?purchased=1', req.url).toString(),
            cancel_url: new URL('/web/plan', req.url).toString(),
        });

        // Pending record; membership is granted ONLY by the verified webhook.
        await webDb.payments.create({
            data: {
                paid: 0,
                plan: plan.ID,
                user: user.ID,
                email,
                tid,
                date: Math.floor(Date.now() / 1000),
            },
        });

        return NextResponse.json({
            status: 'pending',
            message: 'Complete payment on Stripe.',
            tid,
            checkout_url: checkout.url,
        });
    } catch (error) {
        console.error('Stripe POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create Stripe checkout session.' },
            { status: 500 }
        );
    }
}

async function handleWebhook(req: NextRequest): Promise<NextResponse> {
    try {
        if (!features.payments) {
            return NextResponse.json({ received: true });
        }

        const signature = req.headers.get('stripe-signature');
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        const stripe = await stripeClient();

        if (!signature || !secret || !stripe) {
            return NextResponse.json(
                { error: 'Webhook signature verification is not configured.' },
                { status: 400 }
            );
        }

        const rawBody = await req.text();
        let event: Stripe.Event;
        try {
            event = await stripe.webhooks.constructEventAsync(rawBody, signature, secret);
        } catch {
            console.error('Stripe webhook signature verification FAILED');
            return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
        }

        if (event.type === 'checkout.session.completed') {
            const sess = event.data.object as Stripe.Checkout.Session;
            const tid = sess.metadata?.tid;
            const userId = parseInt(sess.metadata?.userId || '0', 10);
            const planId = parseInt(sess.metadata?.planId || '0', 10);

            if (tid && userId && planId) {
                const payment = await webDb.payments.findFirst({ where: { tid } });
                // Idempotency guard: paid === 0 means not yet processed.
                if (payment && Number(payment.paid) === 0) {
                    const plan = await webDb.plans.findUnique({ where: { ID: planId } });
                    const days = plan ? Math.max(plan.length, 1) : 30;
                    const now = Math.floor(Date.now() / 1000);
                    await webDb.payments.update({
                        where: { ID: payment.ID },
                        data: { paid: Number(sess.amount_total ?? 0) / 100 },
                    });
                    await webDb.users.update({
                        where: { ID: userId },
                        data: { membership: planId, expire: now + days * 24 * 60 * 60 },
                    });
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Stripe webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
    }
}
