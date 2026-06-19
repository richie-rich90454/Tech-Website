import { NextRequest, NextResponse } from 'next/server';
import { mainDb } from '@/lib/db/main';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { id } = await req.json();
    await mainDb.submission.update({ where: { id }, data: { accepted: false } });
    return NextResponse.json({ success: true });
}
