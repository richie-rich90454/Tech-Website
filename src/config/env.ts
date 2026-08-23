/**
 * ============================================================================
 * CONFIG - ENVIRONMENT ACCESSOR
 * ============================================================================
 *
 * PURPOSE
 * One typed object that reads process.env exactly ONCE at boot and refuses to
 * start when something essential is missing or malformed. After this file runs,
 * the rest of the codebase never touches process.env again - it reads the
 * frozen `env` object below.
 *
 * WHY FAIL-CLOSED?
 * The previous codebase shipped with a hardcoded fallback session secret, so a
 * forgotten env var silently produced FORGEABLE sessions in production. The
 * rule now is the opposite: a missing secret is a boot-time crash whose message
 * tells you exactly how to fix it. Crashing at deploy beats getting hacked.
 *
 * LEARN: SINGLE SOURCE OF TRUTH
 * Reading this file answers "what configuration does this site support?" with
 * no other research. Add new settings here first; the compiler then guides you
 * to every call site that needs them.
 */

// Development convenience: tsx watch doesn't support --env-file, so we load
// .env here when the variables aren't already set (production uses
// node --env-file=.env which populates process.env BEFORE this module runs).
if (!process.env.SESSION_SECRET) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('dotenv').config();
    } catch {
        // dotenv not installed in production; --env-file handles it there.
    }
}

function requiredString(name: string, minLength = 1): string {
    const value = process.env[name];
    if (!value || value.length < minLength) {
        const suffix = minLength > 1 ? ` (min ${minLength} chars)` : '';
        throw new Error(
            `Missing environment variable ${name}${suffix}. Generate with: openssl rand -base64 32`
        );
    }
    return value;
}

/** Optional with a sane default; never throws for non-essential settings. */
function optionalNumber(name: string, fallback: number): number {
    const parsed = Number(process.env[name]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * THE configuration object. Imported everywhere, mutated nowhere (frozen).
 *
 * Session secrets are REQUIRED unconditionally - not just in production -
 * because a developer testing with forgeable cookies builds habits that
 * ship. The old code threw only when NODE_ENV=production; that gap is closed.
 */
export const env = Object.freeze({
    isProd: process.env.NODE_ENV === 'production',
    port: optionalNumber('PORT', 3000),

    sessionSecretMain: requiredString('SESSION_SECRET', 32),
    sessionSecretWeb: requiredString('SESSION_SECRET_WEB', 32),
    /** Cookie lifetime in seconds - parity with the previous site (30 min). */
    sessionTtlSeconds: optionalNumber('SESSION_TTL_SECONDS', 1800),
});
