import { notFound } from 'next/navigation';
import { mainDb } from '@/lib/db/main';
import EditForm from './EditForm';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) notFound();

  const [submission, domain] = await Promise.all([
    mainDb.submission.findUnique({ where: { id: idNum } }),
    mainDb.domains.findUnique({ where: { id: idNum } }),
  ]);

  if (!submission) notFound();

  return (
    <div id="wrap">
      <div id="adminTopbar"><h1>Edit Submission #{idNum}</h1></div>
      <div id="adminNav">
        <ul>
          <li><a href="/admin">&larr; Back to Admin</a></li>
        </ul>
      </div>
      <EditForm submission={submission} domain={domain} />
    </div>
  );
}