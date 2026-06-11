import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface MainSession {
  islogin?: boolean;
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  cookieName: 'main-session',
  ttl: 1800, // 30 minutes
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
};

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