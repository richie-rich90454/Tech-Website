import { NextResponse } from 'next/server';
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
      select: { referral: true, referralbalance: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const referralLink = user.referral
      ? `https://ipstress.com/web/register?ref=${user.referral}`
      : 'N/A';

    // Count referred users
    const referralCount = await webDb.users.count({
      where: { referedBy: session.userId },
    });

    return NextResponse.json({
      referralLink,
      referralCount,
      referralBalance: user.referralbalance,
    });
  } catch (error) {
    console.error('Affiliate GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch affiliate stats' }, { status: 500 });
  }
}