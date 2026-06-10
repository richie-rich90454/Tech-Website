import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET() {
  const plans = await webDb.plans.findMany({ orderBy: { ID: 'asc' } });
  return NextResponse.json({ plans });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const action = formData.get('action') as string;

  if (action === 'create') {
    const name = formData.get('name') as string;
    const mbt = parseInt(formData.get('mbt') as string) || 60;
    const unit = (formData.get('unit') as string) || 'seconds';
    const length = parseInt(formData.get('length') as string) || 30;
    const price = parseFloat(formData.get('price') as string) || 0;
    const concurrents = parseInt(formData.get('concurrents') as string) || 1;
    const vip = parseInt(formData.get('vip') as string) || 0;
    const isPrivate = parseInt(formData.get('private') as string) || 0;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await webDb.plans.create({
      data: { name, mbt, unit, length, price, concurrents, vip, private: isPrivate },
    });
    return NextResponse.redirect(new URL('/web/admin/plans', req.url));
  }

  if (action === 'delete') {
    const id = parseInt(formData.get('id') as string);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 });
    }
    await webDb.plans.delete({ where: { ID: id } });
    return NextResponse.redirect(new URL('/web/admin/plans', req.url));
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}