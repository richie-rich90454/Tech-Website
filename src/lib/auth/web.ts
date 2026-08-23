import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import type { WebSession } from '@/types/session';
import { webDb } from '@/lib/db/web';

export type { WebSession } from '@/types/session';

const sessionOptions: SessionOptions = {
    password: resolveSecret(),
    cookieName: 'web-session',
    ttl: 1800,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
    },
};

function resolveSecret(): string {
    const secret = process.env.SESSION_SECRET_WEB;
    if (!secret || secret.length < 32) {
        throw new Error(
            'SESSION_SECRET_WEB is missing or shorter than 32 chars. Generate one with: openssl rand -base64 32'
        );
    }
    return secret;
}

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

// Admin = rank 1+. Verifies the session user still exists and holds the rank,
// so demoted/deleted users lose API access immediately.
export async function isWebAdmin(): Promise<boolean> {
    const session = await getWebSession();
    if (!session.userId) return false;
    const user = await webDb.users.findUnique({
        where: { ID: session.userId },
        select: { rank: true },
    });
    return !!user && Number(user.rank) >= 1;
}
