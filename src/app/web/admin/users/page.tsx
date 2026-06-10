import { webDb } from '@/lib/db/web';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const perPage = 20;
  const currentPage = Math.max(1, parseInt(sp.page || '1') || 1);

  const [users, total] = await Promise.all([
    webDb.users.findMany({
      orderBy: { ID: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
      select: {
        ID: true,
        username: true,
        rank: true,
        membership: true,
        expire: true,
        status: true,
        referralbalance: true,
      },
    }),
    webDb.users.count(),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const plans = await webDb.plans.findMany({ select: { ID: true, name: true } });
  const planMap = new Map(plans.map((p) => [p.ID, p.name]));

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">User Management</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql">IPstress</li>
                <li className="breadcrumb-item text-muted">Users</li>
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
                <h4 className="card-title">All Users ({total})</h4>
                <div className="table-responsive mt-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Rank</th>
                        <th>Plan</th>
                        <th>Expire</th>
                        <th>Balance</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center text-muted">No users found.</td>
                        </tr>
                      ) : (
                        users.map((u) => (
                          <tr key={u.ID}>
                            <td>{u.ID}</td>
                            <td>{u.username}</td>
                            <td>{u.rank}</td>
                            <td>{u.membership ? planMap.get(u.membership) || '-' : '-'}</td>
                            <td>{u.expire ? new Date(u.expire * 1000).toLocaleDateString() : '-'}</td>
                            <td>{u.referralbalance}¥</td>
                            <td>
                              <span className={`badge ${u.status === 1 ? 'badge-danger' : 'badge-success'}`}>
                                {u.status === 1 ? 'Banned' : 'Active'}
                              </span>
                            </td>
                            <td>
                              <a href={`/web/admin/users/${u.ID}`} className="btn btn-sm btn-primary mr-1">Edit</a>
                              <form method="POST" action="/web/api/admin/users" style={{ display: 'inline' }}>
                                <input type="hidden" name="id" value={u.ID} />
                                <input type="hidden" name="action" value={u.status === 1 ? 'unban' : 'ban'} />
                                <button type="submit" className={`btn btn-sm ${u.status === 1 ? 'btn-success' : 'btn-warning'} mr-1`}>
                                  {u.status === 1 ? 'Unban' : 'Ban'}
                                </button>
                              </form>
                              <form method="POST" action="/web/api/admin/users" style={{ display: 'inline' }}>
                                <input type="hidden" name="id" value={u.ID} />
                                <input type="hidden" name="action" value="delete" />
                                <button type="submit" className="btn btn-sm btn-danger" onClick={(e) => { if (!confirm('Delete this user?')) e.preventDefault(); }}>
                                  Delete
                                </button>
                              </form>
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
                      <a
                        key={p}
                        href={`/web/admin/users?page=${p}`}
                        className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-secondary'} mr-1`}
                      >
                        {p}
                      </a>
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