import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function AdminAttackLogsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const sp = await searchParams;
    const perPage = 20;
    const currentPage = Math.max(1, parseInt(sp.page || '1') || 1);

    const now = Math.floor(Date.now() / 1000);

    const [logs, total] = await Promise.all([
        webDb.logs.findMany({
            orderBy: { date: 'desc' },
            skip: (currentPage - 1) * perPage,
            take: perPage,
            select: {
                id: true,
                user: true,
                ip: true,
                method: true,
                postdata: true,
                time: true,
                date: true,
                stopped: true,
            },
        }),
        webDb.logs.count(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Attack Logs
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql">IPstress</li>
                                <li className="breadcrumb-item text-muted">Attack Logs</li>
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
                                <h4 className="card-title">Attack Logs ({total})</h4>
                                <div className="table-responsive mt-4">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>User</th>
                                                <th>Target</th>
                                                <th>Port</th>
                                                <th>Method</th>
                                                <th>Time</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={9}
                                                        className="text-center text-muted"
                                                    >
                                                        No logs found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                logs.map((l) => (
                                                    <tr key={l.id}>
                                                        <td>{l.id}</td>
                                                        <td>{l.user}</td>
                                                        <td>{l.ip}</td>
                                                        <td>{l.postdata || '-'}</td>
                                                        <td>{l.method}</td>
                                                        <td>{l.time}s</td>
                                                        <td>
                                                            {new Date(
                                                                l.date * 1000
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td>
                                                            <span
                                                                className={`badge ${l.stopped ? 'badge-secondary' : l.date + l.time > now ? 'badge-warning' : 'badge-success'}`}
                                                            >
                                                                {l.stopped
                                                                    ? 'Stopped'
                                                                    : l.date + l.time > now
                                                                      ? 'Running'
                                                                      : 'Done'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {!l.stopped &&
                                                                l.date + l.time > now && (
                                                                    <form
                                                                        method="POST"
                                                                        action="/web/api/admin/attacklogs"
                                                                        style={{
                                                                            display: 'inline',
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="hidden"
                                                                            name="action"
                                                                            value="stop"
                                                                        />
                                                                        <input
                                                                            type="hidden"
                                                                            name="id"
                                                                            value={l.id}
                                                                        />
                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-sm btn-danger"
                                                                        >
                                                                            Stop
                                                                        </button>
                                                                    </form>
                                                                )}
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
                                                    href={`/web/admin/attacklogs?page=${p}`}
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
