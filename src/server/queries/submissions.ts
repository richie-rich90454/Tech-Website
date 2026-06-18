import 'server-only';
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

export async function getAcceptedSubmissions(): Promise<SubmissionRow[]> {
  return mainDb.submission.findMany({ where: { accepted: true } });
}

export async function getAllSubmissions(): Promise<SubmissionRow[]> {
  return mainDb.submission.findMany({ orderBy: { id: 'desc' } });
}

export async function getDomainsByColumns(columns: string[]): Promise<domains[]> {
  const conditions = columns.map((col) => ({ [col]: true }));
  return mainDb.domains.findMany({ where: { OR: conditions } });
}

export async function getAllDomains(): Promise<DomainRow[]> {
  return mainDb.domains.findMany();
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
  return mainDb.submission.create({ data });
}

export async function updateSubmission(
  id: number,
  data: SubmissionUpdateInput,
): Promise<SubmissionRow> {
  return mainDb.submission.update({ where: { id }, data });
}

export async function acceptSubmission(id: number): Promise<SubmissionRow> {
  return mainDb.submission.update({ where: { id }, data: { accepted: true } });
}

export async function rejectSubmission(id: number): Promise<SubmissionRow> {
  return mainDb.submission.update({ where: { id }, data: { accepted: false } });
}

export async function deleteSubmission(id: number): Promise<void> {
  await mainDb.submission.delete({ where: { id } });
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
  return mainDb.domains.create({ data });
}

export async function updateDomain(
  id: number,
  data: Partial<Omit<CreateDomainInput, 'id'>>,
): Promise<DomainRow> {
  return mainDb.domains.update({ where: { id }, data });
}

export async function deleteDomain(id: number): Promise<void> {
  await mainDb.domains.delete({ where: { id } });
}

export async function getNextSubmissionId(): Promise<number> {
  const last = await mainDb.submission.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true },
  });
  return (last?.id ?? 0) + 1;
}
