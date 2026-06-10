import { notFound } from 'next/navigation';
import { tlConfigs } from '@/lib/tl-config';
import { mainDb } from '@/lib/db/main';
import TLPageClient from './TLPageClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ tl: string }>;
  searchParams: Promise<Record<string, string>>;
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