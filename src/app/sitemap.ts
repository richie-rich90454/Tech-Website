import type { MetadataRoute } from 'next';
import { tlConfigs } from '@/lib/tl-config';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
    const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const now = new Date();

    const statics = ['', '/search', '/submission', '/login', '/web'].map((path) => ({
        url: `${site}${path}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1 : 0.7,
    }));

    const tls = Object.keys(tlConfigs).map((tl) => ({
        url: `${site}/${tl}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...statics, ...tls];
}
