import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function AdminLoginLogsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const sp = await searchParams;
    const perPage = 20;
    const currentPage = Math.max(1, parseInt(sp.page || '1') || 1);

    const [logs, total] = await Promise.all([
        webDb.loginlogs.findMany({
            orderBy: { date: 'desc' },
            skip: (currentPage - 1) * perPage,
            take: perPage,
        }),
        webDb.loginlogs.count(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Login Logs
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql">IPstress</li>
                                <li className="breadcrumb-item text-muted">Login Logs</li>
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
                                <h4 className="card-title">Login History ({total})</h4>
                                <div className="table-responsive mt-4">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Username</th>
                                                <th>IP Address</th>
                                                <th>Country</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="text-center text-muted"
                                                    >
                                                        No login logs found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                logs.map((l) => (
                                                    <tr key={l.id}>
                                                        <td>{l.id}</td>
                                                        <td>{l.username}</td>
                                                        <td>{l.ip}</td>
                                                        <td>{l.country}</td>
                                                        <td>
                                                            {new Date(
                                                                l.date * 1000
                                                            ).toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {totalPages > 1 && (
                                    <div className="mt-3">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                            (p) => (
                                                <a
                                                    key={p}
                                                    href={`/web/admin/loginlogs?page=${p}`}
                                                    className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-secondary'} mr-1`}
                                                >
                                                    {p}
                                                </a>
                                            )
                                        )}
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
