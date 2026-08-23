/**
 * ============================================================================
 * CORE MODULE 06 - TTL CACHE
 * READING ORDER: 04-html -> 06-cache (no other core dependencies).
 * ============================================================================
 *
 * PURPOSE
 * A tiny in-memory key/value store where every entry expires after a number of
 * seconds. Two jobs on this site:
 *
 *   1. Whole finished pages (home, TL lists) are rendered ONCE and reused for
 *      every visitor until an admin changes the underlying data.
 *   2. Any expensive computed value that many requests share.
 *
 * WHY NOT REDIS/MEMCACHED?
 * This site runs as a single Node process backed by a local SQLite file. An
 * external cache would add a network hop, a second thing to secure, and a CVE
 * surface - to save microseconds that SQLite already delivers. Boring wins.
 * The class is deliberately small (~70 lines) so you can audit every line.
 *
 * LEARN: LAZY EXPIRATION
 * Instead of running a background timer per entry (timers cost memory and CPU),
 * each value stores its own expiry timestamp. Entries are checked when read and
 * swept opportunistically when the map grows. This is how many production
 * caches work - correctness comes from checking timestamps, not from timers.
 *
 * EXTEND IT
 * Need statistics? Add hitCount/missCount fields incremented in get() and log
 * them from the slow-request sentinel (core/09-errors.ts). That is the exact
 * spot future metrics should live.
 */

interface Entry<V> {
    value: V;
    /** Absolute unix epoch (milliseconds) after which this entry is stale. */
    expiresAtMs: number;
}

export class TtlCache<V> {
    private readonly map = new Map<string, Entry<V>>();

    /**
     * Sweep threshold: past this size, a set() prunes expired entries instead of
     * letting the map grow without bound. Chosen larger than any realistic page
     * count; it exists as a safety valve, not a tuning knob.
     */
    private static readonly SWEEP_AT = 512;

    constructor(
        /** Default lifetime applied by set() when no explicit ttl is passed. */
        private readonly defaultTtlSeconds = 60
    ) {}

    /** Fetch a live value, or undefined if absent/expired. Lazily deletes stale entries. */
    get(key: string): V | undefined {
        const entry = this.map.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiresAtMs) {
            this.map.delete(key);
            return undefined;
        }
        return entry.value;
    }

    set(key: string, value: V, ttlSeconds?: number): void {
        if (this.map.size >= TtlCache.SWEEP_AT) this.sweep();
        const ttl = (ttlSeconds ?? this.defaultTtlSeconds) * 1000;
        this.map.set(key, { value, expiresAtMs: Date.now() + ttl });
    }

    /** Wrap get-or-compute: returns cached value or runs `produce`, caching the result. */
    async remember(key: string, produce: () => Promise<V>, ttlSeconds?: number): Promise<V> {
        const hit = this.get(key);
        if (hit !== undefined) return hit;
        const fresh = await produce();
        this.set(key, fresh, ttlSeconds);
        return fresh;
    }

    /**
     * Invalidate entries.
     *   bust('home')      -> removes exactly "home"
     *   bust('tl:*')      -> removes every key STARTING with "tl:" (wildcard)
     * Admin writes call this so visitors never see stale pages after edits.
     */
    bust(keyOrPattern: string | string[]): void {
        const patterns = Array.isArray(keyOrPattern) ? keyOrPattern : [keyOrPattern];
        for (const pattern of patterns) {
            if (pattern.endsWith('*')) {
                const prefix = pattern.slice(0, -1);
                for (const key of this.map.keys()) {
                    if (key.startsWith(prefix)) this.map.delete(key);
                }
            } else {
                this.map.delete(pattern);
            }
        }
    }

    /** Drop everything (used by tests). */
    clear(): void {
        this.map.clear();
    }

    private sweep(): void {
        const now = Date.now();
        for (const [key, entry] of this.map) {
            if (now > entry.expiresAtMs) this.map.delete(key);
        }
    }
}

/**
 * THE page cache. One instance, shared by the whole application, lives in
 * server.ts and is injected wherever needed. Keys used today:
 *   'home'    - the public landing page
 *   'tl:tl1'.. 'tl:tl4' - filtered tool-listing pages
 */
export const pageCache = new TtlCache<string>(60);
