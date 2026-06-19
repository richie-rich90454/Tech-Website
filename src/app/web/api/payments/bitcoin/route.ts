import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';

export async function POST(req: NextRequest): Promise<NextResponse> {
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
        const email = (formData.get('email') as string)?.trim() || user.username + '@bitcoin.stub';
        const amount = parseFloat((formData.get('amount') as string) || '0');

        if (!planId || isNaN(planId) || planId <= 0) {
            return NextResponse.json({ error: 'Invalid plan.' }, { status: 400 });
        }

        // Bitcoin stub: create a payments record as pending
        const tid =
            'BTC-' +
            Date.now().toString(36).toUpperCase() +
            '-' +
            Math.random().toString(36).substring(2, 8).toUpperCase();
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

        const settings = await webDb.settings.findFirst({
            where: { sitename: { not: '' } },
            select: { btc_address: true },
        });

        return NextResponse.json({
            status: 'pending',
            message: 'Bitcoin invoice created. Send payment to the address below.',
            tid: tid,
            btc_address: settings?.btc_address || 'bc1qstubaddress00000000000000000000000000000',
            amount_btc: amount > 0 ? (amount / 50000).toFixed(6) : '0.000100',
        });
    } catch (error) {
        console.error('Bitcoin POST error:', error);
        return NextResponse.json({ error: 'Failed to create Bitcoin invoice.' }, { status: 500 });
    }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await getWebSession();
        if (!session.userId) {
            return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const tid = searchParams.get('tid')?.trim();

        if (!tid) {
            // Return all payments for this user
            const payments = await webDb.payments.findMany({
                where: { user: session.userId },
                orderBy: { date: 'desc' },
                take: 20,
            });

            return NextResponse.json({ payments });
        }

        const payment = await webDb.payments.findFirst({
            where: { tid, user: session.userId },
        });

        if (!payment) {
            return NextResponse.json({ error: 'Payment not found.' }, { status: 404 });
        }

        return NextResponse.json({
            status: 'pending',
            payment: {
                tid: payment.tid,
                plan: payment.plan,
                paid: payment.paid,
                date: payment.date,
            },
        });
    } catch (error) {
        console.error('Bitcoin GET error:', error);
        return NextResponse.json(
            { error: 'Failed to check Bitcoin payment status.' },
            { status: 500 }
        );
    }
}
