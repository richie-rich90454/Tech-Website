import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import type { MainSession } from '@/types/session';

export type { MainSession } from '@/types/session';

const sessionOptions: SessionOptions = {
    password: resolveSecret(),
    cookieName: 'main-session',
    ttl: 1800, // 30 minutes
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
    },
};

function resolveSecret(): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error(
            'SESSION_SECRET is missing or shorter than 32 chars. Generate one with: openssl rand -base64 32'
        );
    }
    return secret;
}

export async function getMainSession(): Promise<IronSession<MainSession>> {
    const cookieStore = await cookies();
    const session = await getIronSession<MainSession>(cookieStore, sessionOptions);
    return session;
}

export async function loginMainSession(): Promise<void> {
    const session = await getMainSession();
    session.islogin = true;
    await session.save();
}

export async function logoutMainSession(): Promise<void> {
    const session = await getMainSession();
    session.destroy();
}

export async function isMainAdmin(): Promise<boolean> {
    const session = await getMainSession();
    return session.islogin === true;
}
