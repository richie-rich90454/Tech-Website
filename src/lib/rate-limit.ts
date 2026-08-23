type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// ponytail: in-memory sliding window, single-instance only; swap for Redis if this ever scales beyond one VPS
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        if (buckets.size > 10_000) prune(now);
        return true;
    }
    bucket.count += 1;
    return bucket.count <= limit;
}

function prune(now: number): void {
    for (const [key, bucket] of buckets) {
        if (now > bucket.resetAt) buckets.delete(key);
    }
}

export function clientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for') ?? '';
    return forwarded.split(',')[0].trim() || 'unknown';
}
