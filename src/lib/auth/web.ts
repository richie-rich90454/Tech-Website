import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import type { WebSession } from '@/types/session';

export type { WebSession } from '@/types/session';

const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET_WEB || 'web-fallback-secret-change-in-production',
    cookieName: 'web-session',
    ttl: 1800,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    },
};

export async function getWebSession(): Promise<IronSession<WebSession>> {
    const cookieStore = await cookies();
    return getIronSession<WebSession>(cookieStore, sessionOptions);
}

export async function loginWebSession(user: {
    id: number;
    username: string;
    rank: number;
}): Promise<void> {
    const session = await getWebSession();
    session.userId = user.id;
    session.username = user.username;
    session.rank = user.rank;
    await session.save();
}

export async function logoutWebSession(): Promise<void> {
    const session = await getWebSession();
    session.destroy();
}
