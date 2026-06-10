import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';

export async function POST(req: NextRequest) {
  try {
    const session = await getWebSession();
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const code = (formData.get('code') as string)?.trim();

    if (!code) {
      return NextResponse.json({ error: 'Gift card code is required.' }, { status: 400 });
    }

    const giftcard = await webDb.giftcards.findFirst({
      where: {
        code,
        claimedby: 0,
      },
    });

    if (!giftcard) {
      return NextResponse.json({ error: 'Invalid or already claimed gift card code.' }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);

    // Look up the plan
    const plan = await webDb.plans.findUnique({
      where: { ID: giftcard.planID },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan associated with this gift card no longer exists.' }, { status: 400 });
    }

    // Calculate expiry: current time + plan length in days
    const expiryDate = now + plan.length * 86400;

    // Update user membership
    await webDb.users.update({
      where: { ID: session.userId },
      data: {
        membership: plan.ID,
        expire: expiryDate,
      },
    });

    // Mark gift card as claimed
    await webDb.giftcards.update({
      where: { ID: giftcard.ID },
      data: {
        claimedby: session.userId,
        dateClaimed: now,
      },
    });

    return NextResponse.json({ success: `Gift card redeemed! You now have the ${plan.name} plan.` });
  } catch (error) {
    console.error('Giftcard redeem error:', error);
    return NextResponse.json({ error: 'Failed to redeem gift card' }, { status: 500 });
  }
}