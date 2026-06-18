// Session shapes for the main app and the /web subproject.
// Both wrap iron-session payloads; the wrappers come from `iron-session`.

export interface MainSession {
  islogin?: boolean;
}

export interface WebSession {
  userId?: number;
  username?: string;
  rank?: number;
}

export type SessionWithAdmin<T> = T & { isAdmin: boolean };

export function isAdmin(rank: number | undefined): boolean {
  return typeof rank === 'number' && rank >= 1;
}
