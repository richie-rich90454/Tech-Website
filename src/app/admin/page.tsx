import { redirect } from 'next/navigation';
import { getMainSession } from '@/lib/auth/main';
import { mainDb } from '@/lib/db/main';
import AdminTable from './AdminTable';

export default async function AdminPage() {
  const session = await getMainSession();
  if (!session.islogin) redirect('/login');

  const subs = await mainDb.submission.findMany({ orderBy: { id: 'desc' } });
  const domains = await mainDb.domains.findMany();
  const domainMap = new Map(domains.map((d) => [d.id, d]));

  return (
    <div id="wrap">
      <div id="adminTopbar"><h1>Admin Panel</h1></div>
      <div id="adminNav">
        <ul>
          <li><b>Admin Panel</b></li>
          <li><a href="/admin">All Submissions</a></li>
          <li><a href="/api/import">Import Excel Data</a></li>
          <li><a href="/api/auth/logout">Logout</a></li>
        </ul>
      </div>
      <AdminTable subs={subs} domainMap={domainMap} />
    </div>
  );
}