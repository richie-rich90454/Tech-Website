import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { isWebAdmin } from '@/lib/auth/web';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
    if (!(await isWebAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
        return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const user = await webDb.users.findUnique({ where: { ID: userId } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
}
