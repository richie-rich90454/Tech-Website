import { NextRequest, NextResponse } from 'next/server';
import { mainDb } from '@/lib/db/main';
import { isMainAdmin } from '@/lib/auth/main';

export async function POST(req: NextRequest): Promise<NextResponse> {
    if (!(await isMainAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await req.json();
    await mainDb.domains.delete({ where: { id } });
    await mainDb.submission.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
