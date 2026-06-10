import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import bcrypt from 'bcryptjs';
import { webLoginSchema } from '@/lib/validations/web-auth';
import { loginWebSession } from '@/lib/auth/web';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const parsed = webLoginSchema.safeParse({ username, password });
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const user = await webDb.users.findFirst({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: 'The username does not exist in our system.' }, { status: 401 });
    }

    if (user.status === 1) {
      return NextResponse.json({ error: 'Your account has been banned.' }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'The password you entered is invalid.' }, { status: 401 });
    }

    await loginWebSession({ id: user.ID, username: user.username, rank: user.rank });

    return NextResponse.redirect(new URL('/web/dashboard', req.url));
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}