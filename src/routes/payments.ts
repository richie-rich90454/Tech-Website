import { Application } from '../core/01-application';
import { Context } from '../core/03-context';
import { HttpError } from '../core/09-errors';
import { requireWebUser } from './guards';
import { features } from '../config/features';
import { webDb } from '../lib/db/web';

async function stripeClient(): Promise<any> {
    const key =
        process.env.STRIPE_SECRET_KEY ||
        (await webDb.settings.findFirst({ select: { stripeSecretKey: true } }))?.stripeSecretKey;
    if (!key) return null;
    // Lazy require avoids Stripe SDK type resolution issues at compile time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const StripeCtor = require('stripe');
    return new StripeCtor(key);
}

function genTid(prefix: string): string {
    return (
        prefix +
        '-' +
        Date.now().toString(36).toUpperCase() +
        '-' +
        Math.random().toString(36).substring(2, 8).toUpperCase()
    );
}

async function currentUser(ctx: Context) {
    const session = await requireWebUser(ctx);
    const user = await webDb.users.findUnique({ where: { ID: session.userId! } });
    if (!user) ctx.throw(404, 'User not found');
    return user;
}

export function registerPaymentRoutes(app: Application): void {
    app.post(
        '/web/api/payments/stripe',
        async (ctx: Context) => {
            if (!features.payments) {
                ctx.json({ error: 'Payments are disabled.' }, 403);
                return;
            }
            const user = await currentUser(ctx);
            const stripe = await stripeClient();
            if (!stripe) {
                ctx.json({ error: 'Stripe is not configured.' }, 503);
                return;
            }
            const f = await ctx.form();
            const planId = parseInt(f.plan || '0', 10);
            const email = f.email?.trim() ?? '';
            if (!planId) throw new HttpError(400, 'Invalid plan.');
            if (!email) throw new HttpError(400, 'Email is required.');
            const plan = await webDb.plans.findUnique({ where: { ID: planId } });
            if (!plan || plan.price <= 0) throw new HttpError(404, 'Plan not found.');
            const tid = genTid('STRIPE');
            const checkout = await stripe.checkout.sessions.create({
                mode: 'payment',
                customer_email: email,
                line_items: [
                    {
                        quantity: 1,
                        price_data: {
                            currency: 'usd',
                            unit_amount: Math.round(plan.price * 100),
                            product_data: { name: plan.name + ' membership' },
                        },
                    },
                ],
                metadata: { tid, userId: String(user.ID), planId: String(plan.ID) },
                success_url: new URL('/web/dashboard?purchased=1', ctx.url.origin).toString(),
                cancel_url: new URL('/web/plan', ctx.url.origin).toString(),
            });
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
            ctx.json({
                status: 'pending',
                message: 'Complete payment on Stripe.',
                tid,
                checkout_url: checkout.url,
            });
        },
        { guard: 'webUser' }
    );

    // Stripe webhook: reads raw body BEFORE any parser touches it.
    app.post('/web/api/payments/stripe/webhook', async (ctx: Context) => {
        if (!features.payments) {
            ctx.json({ received: true });
            return;
        }
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        const stripe = await stripeClient();
        if (!secret || !stripe)
            throw new HttpError(400, 'Webhook signature verification is not configured.');
        const signature = ctx.raw.headers['stripe-signature'] as string | undefined;
        if (!signature) throw new HttpError(400, 'Missing signature.');
        const raw = await new Promise<string>((resolve, reject) => {
            let data = '';
            ctx.raw.on('data', (c: Buffer) => (data += c.toString()));
            ctx.raw.on('end', () => resolve(data));
            ctx.raw.on('error', reject);
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let event: any;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            event = await (stripe as any).webhooks.constructEventAsync(raw, signature, secret);
        } catch {
            console.error('Stripe webhook signature FAILED');
            throw new HttpError(400, 'Invalid signature.');
        }
        if (event.type === 'checkout.session.completed') {
            const sess = event.data.object;
            const tid = sess.metadata?.tid;
            const userId = parseInt(sess.metadata?.userId || '0', 10);
            const planId = parseInt(sess.metadata?.planId || '0', 10);
            if (tid && userId && planId) {
                const payment = await webDb.payments.findFirst({ where: { tid } });
                if (payment && Number(payment.paid) === 0) {
                    const plan = await webDb.plans.findUnique({ where: { ID: planId } });
                    const days = plan ? Math.max(plan.length, 1) : 30;
                    await webDb.payments.update({
                        where: { ID: payment.ID },
                        data: { paid: Number(sess.amount_total ?? 0) / 100 },
                    });
                    await webDb.users.update({
                        where: { ID: userId },
                        data: { membership: planId, expire: now() + days * 86400 },
                    });
                }
            }
        }
        ctx.json({ received: true });
    });

    // PayPal stub
    app.post(
        '/web/api/payments/paypal',
        async (ctx: Context) => {
            if (!features.payments) {
                ctx.json({ error: 'Payments are disabled.' }, 403);
                return;
            }
            const user = await currentUser(ctx);
            const f = await ctx.form();
            const planId = parseInt(f.plan || '0', 10);
            if (!planId) throw new HttpError(400, 'Invalid plan.');
            const email = f.email?.trim() ?? '';
            if (!email) throw new HttpError(400, 'Email is required.');
            const tid = genTid('PAYPAL');
            await webDb.payments.create({
                data: {
                    paid: num(f, 'amount'),
                    plan: planId,
                    user: user.ID,
                    email,
                    tid,
                    date: Math.floor(Date.now() / 1000),
                },
            });
            ctx.json({ status: 'pending', message: 'PayPal payment recorded.', tid });
        },
        { guard: 'webUser' }
    );

    // Bitcoin stub
    app.post(
        '/web/api/payments/bitcoin',
        async (ctx: Context) => {
            if (!features.payments) {
                ctx.json({ error: 'Payments are disabled.' }, 403);
                return;
            }
            const user = await currentUser(ctx);
            const f = await ctx.form();
            const planId = parseInt(f.plan || '0', 10);
            if (!planId) throw new HttpError(400, 'Invalid plan.');
            const email = f.email?.trim() ?? '';
            const settings = await webDb.settings.findFirst({ select: { btc_address: true } });
            const tid = genTid('BTC');
            await webDb.payments.create({
                data: {
                    paid: 0,
                    plan: planId,
                    user: user.ID,
                    email,
                    tid,
                    date: Math.floor(Date.now() / 1000),
                },
            });
            ctx.json({
                status: 'pending',
                btc_address: settings?.btc_address ?? '',
                amount: f.amount,
                tid,
            });
        },
        { guard: 'webUser' }
    );
}

function num(f: Record<string, string>, key: string): number {
    return parseFloat(f[key] || '0') || 0;
}
function now(): number {
    return Math.floor(Date.now() / 1000);
}
