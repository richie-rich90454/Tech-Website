import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getWebSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await webDb.users.findUnique({
      where: { ID: session.userId },
      select: { username: true, referralbalance: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const paymentMethod = (formData.get('paymentMethod') as string)?.trim();
    const paymentAddress = (formData.get('paymentAddress') as string)?.trim();
    const amountStr = (formData.get('amount') as string)?.trim();

    if (!paymentMethod || !paymentAddress || !amountStr) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal amount.' }, { status: 400 });
    }

    if (amount > user.referralbalance) {
      return NextResponse.json({ error: 'Insufficient balance.' }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);

    // Deduct balance from user
    await webDb.users.update({
      where: { ID: session.userId },
      data: {
        referralbalance: user.referralbalance - amount,
      },
    });

    // Create withdrawal record
    await webDb.affiliateWithdraws.create({
      data: {
        userID: session.userId,
        withdrawAmount: amount.toString(),
        paymentMethod,
        paymentAddress,
        status: 0,
        date: now,
      },
    });

    return NextResponse.json({ success: 'Withdrawal request submitted successfully.' });
  } catch (error) {
    console.error('Affiliate withdraw error:', error);
    return NextResponse.json({ error: 'Failed to submit withdrawal' }, { status: 500 });
  }
}