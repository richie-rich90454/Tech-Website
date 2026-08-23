/**
 * Unit test samples: session security + rate limiter.
 * The fake Context here shows WHY core depends on interfaces, not on HTTP:
 * a two-property object is enough to exercise real crypto paths.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SessionManager, type SessionData } from '../../src/core/05-session';
import { rateLimit } from '../../src/lib/rate-limit';

/** Minimal stand-in for Context covering only what SessionManager touches. */
function fakeCtx() {
    const jar = new Map<string, string>();
    return {
        cookie: (name: string) => jar.get(name),
        setCookie: (name: string, value: string) => void jar.set(name, value),
        jar,
    };
}

const SECRET = 'unit-test-secret-unit-test-secret-32!';

test('session: save then load round-trips the payload', () => {
    const sm = new SessionManager('web-session', SECRET, 1800, false);
    const ctx = fakeCtx() as never as Parameters<SessionManager['load']>[0];
    sm.save(ctx, { userId: 7, username: 'admin', rank: 1 });
    const loaded = sm.load(ctx) as SessionData;
    assert.equal(loaded.userId, 7);
    assert.equal(loaded.username, 'admin');
});

test('session: a tampered payload fails the signature check', () => {
    const sm = new SessionManager('web-session', SECRET, 1800, false);
    const ctx = fakeCtx() as never as Parameters<SessionManager['load']>[0];
    sm.save(ctx, { userId: 7 });
    const raw = (ctx as unknown as { jar: Map<string, string> }).jar.get('web-session')!;
    const [, payload, sig] = raw.split('.');
    // Escalate rank 0 -> 9 WITHOUT re-signing: signature no longer matches.
    const evilPayload = Buffer.from(
        JSON.stringify({ userId: 7, rank: 9, e: Math.floor(Date.now() / 1000) + 999 })
    ).toString('base64url');
    (ctx as unknown as { jar: Map<string, string> }).jar.set(
        'web-session',
        `v1.${evilPayload}.${sig}`
    );
    void payload;
    assert.equal(sm.load(ctx), null);
});

test('session: expired tokens are rejected', () => {
    // ttl of -1 second means the token is born already expired.
    const sm = new SessionManager('web-session', SECRET, -1, false);
    const ctx = fakeCtx() as never as Parameters<SessionManager['load']>[0];
    sm.save(ctx, { userId: 1 });
    assert.equal(sm.load(ctx), null);
});

test('rate limiter: trips after max requests in the window', () => {
    const key = `test:${Math.random()}`; // unique bucket so tests never collide
    let allowed = 0;
    for (let i = 0; i < 10; i += 1) if (rateLimit(key, 5, 60_000)) allowed += 1;
    assert.equal(allowed, 5);
});
