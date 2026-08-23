import { NextResponse } from 'next/server';
import { mainDb } from '@/lib/db/main';
import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
    try {
        await Promise.all([mainDb.submission.count(), webDb.users.count()]);
        return NextResponse.json({ status: 'ok', time: new Date().toISOString() });
    } catch {
        return NextResponse.json({ status: 'degraded' }, { status: 503 });
    }
}
