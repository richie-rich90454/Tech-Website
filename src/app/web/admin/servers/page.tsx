import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function AdminServersPage() {
    const servers = await webDb.servers.findMany({ orderBy: { id: 'asc' } });

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        API Server Management
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql">IPstress</li>
                                <li className="breadcrumb-item text-muted">API Servers</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Add Server</h4>
                                <form
                                    method="POST"
                                    action="/web/api/admin/servers"
                                    className="mt-4"
                                >
                                    <input type="hidden" name="action" value="create" />
                                    <div className="form-group">
                                        <label className="text-white">Name</label>
                                        <input className="form-control" name="name" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">IP Address</label>
                                        <input className="form-control" name="ip" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Password</label>
                                        <input
                                            className="form-control"
                                            name="password"
                                            type="password"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Slots</label>
                                        <input
                                            className="form-control"
                                            name="slots"
                                            type="number"
                                            defaultValue="10"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Methods</label>
                                        <input
                                            className="form-control"
                                            name="methods"
                                            defaultValue="UDP,TCP"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success">
                                        Add Server
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">All Servers</h4>
                                <div className="table-responsive mt-4">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>IP</th>
                                                <th>Slots</th>
                                                <th>Methods</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {servers.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="text-center text-muted"
                                                    >
                                                        No servers added yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                servers.map((s) => (
                                                    <tr key={s.id}>
                                                        <td>{s.id}</td>
                                                        <td>{s.name}</td>
                                                        <td>{s.ip}</td>
                                                        <td>{s.slots}</td>
                                                        <td>{s.methods}</td>
                                                        <td>
                                                            <form
                                                                method="POST"
                                                                action="/web/api/admin/servers"
                                                                style={{ display: 'inline' }}
                                                            >
                                                                <input
                                                                    type="hidden"
                                                                    name="action"
                                                                    value="delete"
                                                                />
                                                                <input
                                                                    type="hidden"
                                                                    name="id"
                                                                    value={s.id}
                                                                />
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={(e) => {
                                                                        if (
                                                                            !confirm(
                                                                                'Delete this server?'
                                                                            )
                                                                        )
                                                                            e.preventDefault();
                                                                    }}
                                                                >
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
