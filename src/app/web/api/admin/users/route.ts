import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = 20;

  const [users, total] = await Promise.all([
    webDb.users.findMany({
      orderBy: { ID: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    webDb.users.count(),
  ]);

  return NextResponse.json({ users, total, page, totalPages: Math.ceil(total / perPage) });
}

export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const id = parseInt(formData.get('id') as string);
  const action = formData.get('action') as string;

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  if (action === 'update') {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const rank = parseInt(formData.get('rank') as string) || 0;
    const membership = parseInt(formData.get('membership') as string) || 0;
    const expire = parseInt(formData.get('expire') as string) || 0;
    const status = parseInt(formData.get('status') as string) || 0;
    const testattack = parseInt(formData.get('testattack') as string) || 0;
    const referralbalance = parseInt(formData.get('referralbalance') as string) || 0;

    const data: Record<string, unknown> = {
      username,
      rank,
      membership,
      expire,
      status,
      testattack,
      referralbalance,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 12);
    }

    await webDb.users.update({ where: { ID: id }, data });
    return NextResponse.redirect(new URL('/web/admin/users', req.url));
  }

  if (action === 'ban') {
    await webDb.users.update({ where: { ID: id }, data: { status: 1 } });
    return NextResponse.redirect(new URL('/web/admin/users', req.url));
  }

  if (action === 'unban') {
    await webDb.users.update({ where: { ID: id }, data: { status: 0 } });
    return NextResponse.redirect(new URL('/web/admin/users', req.url));
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const formData = await req.formData();
  const id = parseInt(formData.get('id') as string);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  await webDb.users.delete({ where: { ID: id } });
  return NextResponse.redirect(new URL('/web/admin/users', req.url));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const action = formData.get('action') as string;
  const id = parseInt(formData.get('id') as string);

  if (action === 'delete') {
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    await webDb.users.delete({ where: { ID: id } });
    return NextResponse.redirect(new URL('/web/admin/users', req.url));
  }

  if (action === 'ban') {
    await webDb.users.update({ where: { ID: id }, data: { status: 1 } });
    return NextResponse.redirect(new URL('/web/admin/users', req.url));
  }

  if (action === 'unban') {
    await webDb.users.update({ where: { ID: id }, data: { status: 0 } });
    return NextResponse.redirect(new URL('/web/admin/users', req.url));
  }

  if (action === 'update') {
    return PUT(req);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}