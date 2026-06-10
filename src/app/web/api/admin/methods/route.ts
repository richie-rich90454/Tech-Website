import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET() {
  const methods = await webDb.methods.findMany({ orderBy: { type: 'asc' } });
  return NextResponse.json({ methods });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const action = formData.get('action') as string;

  if (action === 'create') {
    const name = formData.get('name') as string;
    const fullname = formData.get('fullname') as string;
    const type = formData.get('type') as string;
    const command = formData.get('command') as string;

    if (!name || !fullname || !type || !command) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await webDb.methods.create({
      data: { name, fullname, type, command },
    });
    return NextResponse.redirect(new URL('/web/admin/methods', req.url));
  }

  if (action === 'delete') {
    const id = parseInt(formData.get('id') as string);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid method ID' }, { status: 400 });
    }
    await webDb.methods.delete({ where: { id } });
    return NextResponse.redirect(new URL('/web/admin/methods', req.url));
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}