import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET() {
  const giftcards = await webDb.giftcards.findMany({
    orderBy: { date: 'desc' },
  });
  return NextResponse.json({ giftcards });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const action = formData.get('action') as string;

  if (action === 'generate') {
    const planID = parseInt(formData.get('planID') as string);
    const count = parseInt(formData.get('count') as string) || 1;

    if (!planID || isNaN(planID)) {
      return NextResponse.json({ error: 'Please select a plan' }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);
    for (let i = 0; i < count; i++) {
      const code = Array.from({ length: 4 }, () =>
        Math.random().toString(36).substring(2, 6).toUpperCase()
      ).join('-');

      await webDb.giftcards.create({
        data: { code, planID, claimedby: 0, dateClaimed: 0, date: now },
      });
    }

    return NextResponse.redirect(new URL('/web/admin/giftcards', req.url));
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}