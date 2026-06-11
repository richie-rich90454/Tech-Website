import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET(): Promise<NextResponse> {
  const news = await webDb.news.findMany({ orderBy: { ID: 'desc' } });
  return NextResponse.json({ news });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const action = formData.get('action') as string;

  if (action === 'create') {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    await webDb.news.create({ data: { title, content, date } });
    return NextResponse.redirect(new URL('/web/admin/news', req.url));
  }

  if (action === 'delete') {
    const id = parseInt(formData.get('id') as string);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid news ID' }, { status: 400 });
    }
    await webDb.news.delete({ where: { ID: id } });
    return NextResponse.redirect(new URL('/web/admin/news', req.url));
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}