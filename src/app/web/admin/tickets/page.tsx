import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const filter = sp.status || 'all';
  const perPage = 20;
  const currentPage = Math.max(1, parseInt(sp.page || '1') || 1);

  const where: Record<string, unknown> = {};
  if (filter === 'open') where.status = 'Waiting for admin response';
  else if (filter === 'closed') where.status = 'Closed';
  else if (filter === 'user') where.status = 'Waiting for user response';

  const [tickets, total] = await Promise.all([
    webDb.tickets.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
      select: { id: true, subject: true, username: true, status: true, date: true },
    }),
    webDb.tickets.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Tickets</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql">IPstress</li>
                <li className="breadcrumb-item text-muted">Tickets</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <h4 className="card-title mb-0">All Tickets ({total})</h4>
                  <div className="ml-auto">
                    <a href="/web/admin/tickets" className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'} mr-1`}>All</a>
                    <a href="/web/admin/tickets?status=open" className={`btn btn-sm ${filter === 'open' ? 'btn-primary' : 'btn-secondary'} mr-1`}>Open</a>
                    <a href="/web/admin/tickets?status=user" className={`btn btn-sm ${filter === 'user' ? 'btn-primary' : 'btn-secondary'} mr-1`}>User Reply</a>
                    <a href="/web/admin/tickets?status=closed" className={`btn btn-sm ${filter === 'closed' ? 'btn-primary' : 'btn-secondary'}`}>Closed</a>
                  </div>
                </div>
                <div className="table-responsive mt-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Subject</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.length === 0 ? (
                        <tr><td colSpan={6} className="text-center text-muted">No tickets found.</td></tr>
                      ) : (
                        tickets.map((t) => (
                          <tr key={t.id}>
                            <td>#{t.id}</td>
                            <td>{t.subject}</td>
                            <td>{t.username}</td>
                            <td>
                              <span className={`badge ${t.status === 'Closed' ? 'badge-secondary' : 'badge-warning'}`}>
                                {t.status}
                              </span>
                            </td>
                            <td>{new Date(t.date * 1000).toLocaleDateString()}</td>
                            <td>
                              <a href={`/web/admin/tickets/${t.id}`} className="btn btn-sm btn-primary">View</a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="mt-3">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <a key={p} href={`/web/admin/tickets?status=${filter}&page=${p}`} className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-secondary'} mr-1`}>{p}</a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}