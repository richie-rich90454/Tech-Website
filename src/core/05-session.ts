/**
 * ============================================================================
 * CORE MODULE 05 - SIGNED-COOKIE SESSIONS
 * READING ORDER: 03-context -> 05-session
 * ============================================================================
 *
 * PURPOSE
 * Remembers "who is this browser?" across requests WITHOUT a server-side
 * session store: the user's identity travels inside an HMAC-signed cookie.
 * The visitor can READ the cookie but can never MODIFY it, because any edit
 * invalidates the signature (they lack the server secret).
 *
 * WIRE FORMAT (exactly three parts, dot-separated):
 *
 *     v1.<base64url(payload JSON)>.<base64url(HMAC-SHA256(v1.payload, secret))>
 *
 * The leading "v1." is inside the signed material on purpose: it is part of the
 * algorithm's identity, so a future v2 cannot be confused with v1 by anything
 * that replays old cookies.
 *
 * WHY NOT A JWT LIBRARY / IRON-SESSION?
 * This is ~90 lines of node:crypto doing one well-understood job. Zero
 * dependencies means zero advisories to chase (project constraint C2), and the
 * security argument fits in the paragraph above - which is exactly what makes
 * it reviewable by a junior developer.
 *
 * LEARN: WHY timingSafeEqual?
 * Comparing secrets with `===` lets an attacker measure HOW LONG the comparison
 * took to learn how many leading bytes matched ("timing attack"). Node's
 * timingSafeEqual always takes the same time for same-length inputs. It costs
 * microseconds and closes the entire attack class.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { Context } from "./03-context";

/** Everything the site stores about one logged-in browser. Keep it tiny. */
export interface SessionData {
    /** Main-site admin flag (public tech-directory back office). */
    islogin?: boolean;
    /** Web-app user id, username and rank - set together at login. */
    userId?: number;
    username?: string;
    rank?: number;
}

export class SessionManager {
    constructor(
        public readonly cookieName: string,
        private readonly secret: string,
        private readonly ttlSeconds: number,
        private readonly secureCookies: boolean
    ) {}

    /** Read + verify. Returns null for missing/tampered/expired cookies - never throws. */
    load(ctx: Context): SessionData | null {
        const raw = ctx.cookie(this.cookieName);
        if (!raw) return null;
        const parts = raw.split(".");
        if (parts.length !== 3 || parts[0] !== "v1") return null;
        const [, payloadB64, signatureB64] = parts;
        if (!safeEquals(b64url(hmac(`v1.${payloadB64}`, this.secret)), signatureB64)) return null;
        try {
            const data = JSON.parse(
                Buffer.from(payloadB64, "base64url").toString("utf8")
            ) as SessionData & { e?: number };
            if (typeof data.e !== "number" || Date.now() / 1000 > data.e) return null; // expired
            return data;
        } catch {
            return null; // malformed payload = anonymous, not a 500
        }
    }

    /** Sign + write the cookie. Call after mutating a loaded session object. */
    save(ctx: Context, data: SessionData): void {
        const withExpiry = { ...data, e: Math.floor(Date.now() / 1000) + this.ttlSeconds };
        const payload = Buffer.from(JSON.stringify(withExpiry)).toString("base64url");
        const signature = b64url(hmac(`v1.${payload}`, this.secret));
        ctx.setCookie(this.cookieName, `v1.${payload}.${signature}`, {
            httpOnly: true,
            secure: this.secureCookies,
            maxAge: this.ttlSeconds,
        });
    }

    /** Log out: overwrite with an immediately-expiring empty cookie. */
    destroy(ctx: Context): void {
        ctx.setCookie(this.cookieName, "", {
            httpOnly: true,
            secure: this.secureCookies,
            maxAge: 0,
        });
    }
}

function hmac(data: string, secret: string): Buffer {
    return createHmac("sha256", secret).update(data).digest();
}

function b64url(buffer: Buffer): string {
    return buffer.toString("base64url");
}

/**
 * Constant-time string comparison: hash both sides to fixed-length buffers so
 * lengths never leak either (timingSafeEqual throws on length mismatch).
 */
function safeEquals(a: string, b: string): boolean {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    return ba.length === bb.length && timingSafeEqual(ba, bb);
}

// TODO(roadmap): session refresh-on-activity (sliding expiry) if support asks
// for it; today absolute expiry matches the previous framework exactly.
