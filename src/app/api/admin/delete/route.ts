import { NextRequest, NextResponse } from 'next/server';
import { mainDb } from '@/lib/db/main';

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  await mainDb.domains.delete({ where: { id } });
  await mainDb.submission.delete({ where: { id } });
  return NextResponse.json({ success: true });
}