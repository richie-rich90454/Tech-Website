import { getIronSession, SessionOptions } from 'iron-session';
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

export async function getMainSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<MainSession>(cookieStore, sessionOptions);
  return session;
}

export async function loginMainSession() {
  const session = await getMainSession();
  session.islogin = true;
  await session.save();
}

export async function logoutMainSession() {
  const session = await getMainSession();
  session.destroy();
}