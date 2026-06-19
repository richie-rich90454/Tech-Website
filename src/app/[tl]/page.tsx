import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tlConfigs } from '@/lib/tl-config';
import { getAcceptedSubmissions, getDomainsByColumns } from '@/server/queries/submissions';
import TLPageClient from './TLPageClient';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ tl: string }>;
    searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tl } = await params;
    const config = tlConfigs[tl];
    if (!config) return { title: 'TL Not Found' };
    return {
        title: `${config.title} · BIBS·C Tech Tools`,
        description: `Filter and explore tech tools aligned with ${config.title} strands.`,
    };
}

export default async function TLPage({ params, searchParams }: Props) {
    const { tl } = await params;
    const sp = await searchParams;

    const config = tlConfigs[tl];
    if (!config) notFound();

    // Parse checked state: absence or "1" means checked; "0" means unchecked
    const checked = config.strands.map((s) => sp[s.checkboxName] !== '0');

    // Cached reads — submissions list and domain map are both stable until an
    // admin updates them, so the per-request cost is just a Map lookup.
    const [subs, domainEntries] = await Promise.all([
        getAcceptedSubmissions(),
        getDomainsByColumns(config.domainColumns),
    ]);

    const domainById = new Map(domainEntries.map((d) => [d.id, d]));

    const toolsWithTags = subs
        .map((sub) => {
            const entry = domainById.get(sub.id);
            if (!entry) return null;
            const { id: _id, ...tagBooleans } = entry as unknown as { id: number } & Record<
                string,
                boolean
            >;
            return { ...sub, tags: tagBooleans };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

    return <TLPageClient config={config} checked={checked} toolsWithTags={toolsWithTags} tl={tl} />;
}
