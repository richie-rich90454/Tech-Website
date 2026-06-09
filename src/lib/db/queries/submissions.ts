import { mainDb } from '@/lib/db/main';

export async function getAcceptedSubmissions() {
  return mainDb.submission.findMany({ where: { accepted: true } });
}

export async function getDomainsByColumns(columns: string[]) {
  const conditions = columns.map((col) => ({ [col]: true }));
  return mainDb.domains.findMany({ where: { OR: conditions } });
}

export async function getSubmissionById(id: number) {
  return mainDb.submission.findUnique({ where: { id } });
}

export async function createSubmission(data: {
  id: number;
  techname: string;
  tl1_desc: string;
  tl2_desc: string;
  tl3_desc: string;
  tl4_desc: string;
  link: string;
  displaytext: string;
  accepted: boolean;
  username: string;
  contact: string;
}) {
  return mainDb.submission.create({ data });
}

export async function updateSubmission(
  id: number,
  data: Record<string, unknown>,
) {
  return mainDb.submission.update({ where: { id }, data });
}

export async function deleteSubmission(id: number) {
  await mainDb.submission.delete({ where: { id } });
}