import { NextRequest, NextResponse } from 'next/server';
import { mainDb } from '@/lib/db/main';
import bcrypt from 'bcryptjs';
import { loginMainSession } from '@/lib/auth/main';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        if (!rateLimit('main-login:' + clientIp(req), 10, 60_000)) {
            return NextResponse.json(
                { error: 'Too many login attempts. Try again in a minute.' },
                { status: 429 }
            );
        }

        const formData = await req.formData();
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required.' },
                { status: 400 }
            );
        }

        const user = await mainDb.login.findUnique({ where: { User: username } });

        if (!user) {
            return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
        }

        const valid = await bcrypt.compare(password, user.PW);
        if (!valid) {
            return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
        }

        await loginMainSession();
        return NextResponse.redirect(new URL('/admin', req.url));
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
    }
}
