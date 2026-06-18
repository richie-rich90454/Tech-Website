import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { tlConfigs } from '@/lib/tl-config';
import { mainDb } from '@/lib/db/main';
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

  const subs = await mainDb.submission.findMany({ where: { accepted: true } });

  const orConditions = config.domainColumns.map((col) => ({ [col]: true }));
  const domainEntries = await mainDb.domains.findMany({
    where: { OR: orConditions },
  });

  const domainIds = new Set(domainEntries.map((d) => d.id));

  const toolsWithTags = subs
    .filter((sub) => domainIds.has(sub.id))
    .map((sub) => {
      const { id: _id, ...tagBooleans } = domainEntries.find(
        (d) => d.id === sub.id,
      )!;
      return { ...sub, tags: tagBooleans as Record<string, boolean> };
    });

  return (
    <TLPageClient
      config={config}
      checked={checked}
      toolsWithTags={toolsWithTags}
      tl={tl}
    />
  );
}