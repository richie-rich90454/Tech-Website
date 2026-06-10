import { NextResponse } from 'next/server';
import { logoutWebSession } from '@/lib/auth/web';

export async function POST() {
  await logoutWebSession();
  return NextResponse.redirect(new URL('/web', 'http://localhost:3000'));
}