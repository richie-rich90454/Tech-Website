import { redirect } from 'next/navigation';
import { getMainSession } from '@/lib/auth/main';
import { getAllSubmissions, getAllDomains } from '@/server/queries/submissions';
import AdminTable from './AdminTable';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getMainSession();
  if (!session.islogin) redirect('/login');

  const [subs, domains] = await Promise.all([
    getAllSubmissions(),
    getAllDomains(),
  ]);
  const domainMap = new Map(domains.map((d) => [d.id, d]));

  return (
    <div id="wrap">
      <div id="adminTopbar">
        <h1 id="admin-heading">Admin Panel</h1>
      </div>
      <div id="adminNav">
        <ul>
          <li><b>Admin Panel</b></li>
          <li><a href="/admin#submissions">All Submissions</a></li>
          <li><a href="/api/import">Import Excel Data</a></li>
          <li><a href="/api/auth/logout">Logout</a></li>
        </ul>
      </div>
      <section id="submissions" style={{ scrollMarginTop: 'var(--nav-offset)' }}>
        <AdminTable subs={subs} domainMap={domainMap} />
      </section>
    </div>
  );
}
