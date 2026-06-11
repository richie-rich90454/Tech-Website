import { NextResponse } from 'next/server';
import { logoutMainSession } from '@/lib/auth/main';

export async function POST(): Promise<NextResponse> {
  await logoutMainSession();
  return NextResponse.redirect(new URL('/login', 'http://localhost:3000'));
}