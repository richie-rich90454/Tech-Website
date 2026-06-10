import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const session = await getWebSession();
    if (!session.userId) {
      return NextResponse.redirect(new URL('/web/login', req.url));
    }

    const user = await webDb.users.findUnique({
      where: { ID: session.userId },
      select: { password: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const oldPassword = (formData.get('old') as string)?.trim();
    const newPassword = (formData.get('new') as string)?.trim();
    const repeatPassword = (formData.get('rnew') as string)?.trim();

    if (!oldPassword || !newPassword || !repeatPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
    }

    if (newPassword !== repeatPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await webDb.users.update({
      where: { ID: session.userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: 'Password changed successfully.' });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}