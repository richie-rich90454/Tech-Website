import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET(): Promise<NextResponse> {
    const servers = await webDb.servers.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json({ servers });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const formData = await req.formData();
    const action = formData.get('action') as string;

    if (action === 'create') {
        const name = formData.get('name') as string;
        const ip = formData.get('ip') as string;
        const password = formData.get('password') as string;
        const slots = parseInt(formData.get('slots') as string) || 10;
        const methods = formData.get('methods') as string;

        if (!name || !ip || !password) {
            return NextResponse.json(
                { error: 'Name, IP, and password are required' },
                { status: 400 }
            );
        }

        await webDb.servers.create({
            data: { name, ip, password, slots, methods: methods || '' },
        });
        return NextResponse.redirect(new URL('/web/admin/servers', req.url));
    }

    if (action === 'delete') {
        const id = parseInt(formData.get('id') as string);
        if (!id || isNaN(id)) {
            return NextResponse.json({ error: 'Invalid server ID' }, { status: 400 });
        }
        await webDb.servers.delete({ where: { id } });
        return NextResponse.redirect(new URL('/web/admin/servers', req.url));
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
