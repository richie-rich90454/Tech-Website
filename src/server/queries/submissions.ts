import 'server-only';
import { unstable_cache } from 'next/cache';
import { mainDb } from '@/lib/db/main';
import type { domains } from '@/lib/db/generated/main';
import type { SubmissionRow, DomainRow } from '@/types/db';

export interface SubmissionUpdateInput {
    techname?: string;
    tl1_desc?: string;
    tl2_desc?: string;
    tl3_desc?: string;
    tl4_desc?: string;
    link?: string;
    displaytext?: string;
    accepted?: boolean;
    username?: string;
    contact?: string;
}

// ---------------------------------------------------------------------------
// Cached read paths. Submissions and domains are read on every page render,
// but they only change when an admin approves/edits. Wrapping the reads in
// unstable_cache gives us free per-tag invalidation on writes.
// ---------------------------------------------------------------------------
const TAGS = ['submissions', 'domains'] as const;

const getAcceptedSubmissionsCached = unstable_cache(
    async (): Promise<SubmissionRow[]> =>
        mainDb.submission.findMany({
            where: { accepted: true },
            orderBy: { id: 'asc' },
        }),
    ['submissions', 'accepted'],
    { revalidate: 3600, tags: ['submissions'] }
);

const getAllSubmissionsCached = unstable_cache(
    async (): Promise<SubmissionRow[]> => mainDb.submission.findMany({ orderBy: { id: 'desc' } }),
    ['submissions', 'all'],
    { revalidate: 3600, tags: ['submissions'] }
);

const getAllDomainsCached = unstable_cache(
    async (): Promise<DomainRow[]> => mainDb.domains.findMany({ orderBy: { id: 'asc' } }),
    ['domains', 'all'],
    { revalidate: 3600, tags: ['domains'] }
);

export async function getAcceptedSubmissions(): Promise<SubmissionRow[]> {
    return getAcceptedSubmissionsCached();
}

export async function getAllSubmissions(): Promise<SubmissionRow[]> {
    return getAllSubmissionsCached();
}

export async function getDomainsByColumns(columns: string[]): Promise<domains[]> {
    // Cache the full domain map once, filter in memory — the dataset is tiny
    // (one row per tool) and this avoids cache-key explosion.
    const all = await getAllDomainsCached();
    return all.filter((row) =>
        columns.some((c) => (row as unknown as Record<string, unknown>)[c] === true)
    );
}

export async function getAllDomains(): Promise<DomainRow[]> {
    return getAllDomainsCached();
}

// ---------------------------------------------------------------------------
// Cache invalidation. Next.js 16 splits the API: `revalidateTag` now requires
// a cache-life profile, while `updateTag` is the simple "bust this tag" call
// we use here.
// ---------------------------------------------------------------------------
async function invalidateSubmissionCaches(): Promise<void> {
    const { updateTag } = await import('next/cache');
    for (const tag of TAGS) updateTag(tag);
}

export async function getSubmissionById(id: number): Promise<SubmissionRow | null> {
    return mainDb.submission.findUnique({ where: { id } });
}

export async function getDomainById(id: number): Promise<DomainRow | null> {
    return mainDb.domains.findUnique({ where: { id } });
}

export interface CreateSubmissionInput {
    id: number;
    techname: string;
    link: string;
    displaytext: string;
    tl1_desc: string;
    tl2_desc: string;
    tl3_desc: string;
    tl4_desc: string;
    username: string;
    contact: string;
    accepted: boolean;
}

export async function createSubmission(data: CreateSubmissionInput): Promise<SubmissionRow> {
    const row = await mainDb.submission.create({ data });
    await invalidateSubmissionCaches();
    return row;
}

export async function updateSubmission(
    id: number,
    data: SubmissionUpdateInput
): Promise<SubmissionRow> {
    const row = await mainDb.submission.update({ where: { id }, data });
    await invalidateSubmissionCaches();
    return row;
}

export async function acceptSubmission(id: number): Promise<SubmissionRow> {
    const row = await mainDb.submission.update({ where: { id }, data: { accepted: true } });
    await invalidateSubmissionCaches();
    return row;
}

export async function rejectSubmission(id: number): Promise<SubmissionRow> {
    const row = await mainDb.submission.update({ where: { id }, data: { accepted: false } });
    await invalidateSubmissionCaches();
    return row;
}

export async function deleteSubmission(id: number): Promise<void> {
    await mainDb.submission.delete({ where: { id } });
    await invalidateSubmissionCaches();
}

export interface CreateDomainInput {
    id: number;
    R: boolean;
    TP: boolean;
    MT: boolean;
    AR: boolean;
    U: boolean;
    MDL: boolean;
    RA: boolean;
    RoTech: boolean;
    LS: boolean;
    RoThink: boolean;
    EoST: boolean;
    EF: boolean;
    RTE: boolean;
    DLoI: boolean;
    RaAoC: boolean;
}

export async function createDomain(data: CreateDomainInput): Promise<DomainRow> {
    const row = await mainDb.domains.create({ data });
    await invalidateSubmissionCaches();
    return row;
}

export async function updateDomain(
    id: number,
    data: Partial<Omit<CreateDomainInput, 'id'>>
): Promise<DomainRow> {
    const row = await mainDb.domains.update({ where: { id }, data });
    await invalidateSubmissionCaches();
    return row;
}

export async function deleteDomain(id: number): Promise<void> {
    await mainDb.domains.delete({ where: { id } });
    await invalidateSubmissionCaches();
}

export async function getNextSubmissionId(): Promise<number> {
    const last = await mainDb.submission.findFirst({
        orderBy: { id: 'desc' },
        select: { id: true },
    });
    return (last?.id ?? 0) + 1;
}
