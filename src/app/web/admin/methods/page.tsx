import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function AdminMethodsPage() {
    const methods = await webDb.methods.findMany({ orderBy: { type: 'asc' } });

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Method Management
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql">IPstress</li>
                                <li className="breadcrumb-item text-muted">Methods</li>
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
                                <h4 className="card-title">Add Method</h4>
                                <form
                                    method="POST"
                                    action="/web/api/admin/methods"
                                    className="mt-4"
                                >
                                    <input type="hidden" name="action" value="create" />
                                    <div className="form-group">
                                        <label className="text-white">Name</label>
                                        <input
                                            className="form-control"
                                            name="name"
                                            placeholder="UDP"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Full Name</label>
                                        <input
                                            className="form-control"
                                            name="fullname"
                                            placeholder="UDP Flood"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Type</label>
                                        <select className="form-control" name="type" required>
                                            <option value="layer4">Layer 4</option>
                                            <option value="layer7">Layer 7</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Command</label>
                                        <input
                                            className="form-control"
                                            name="command"
                                            placeholder="./udp {host} {port} {time}"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success">
                                        Add Method
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">All Methods</h4>
                                <div className="table-responsive mt-4">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Full Name</th>
                                                <th>Type</th>
                                                <th>Command</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {methods.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="text-center text-muted"
                                                    >
                                                        No methods added yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                methods.map((m) => (
                                                    <tr key={m.id}>
                                                        <td>{m.id}</td>
                                                        <td>{m.name}</td>
                                                        <td>{m.fullname}</td>
                                                        <td>{m.type}</td>
                                                        <td>
                                                            <code>{m.command}</code>
                                                        </td>
                                                        <td>
                                                            <form
                                                                method="POST"
                                                                action="/web/api/admin/methods"
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
                                                                    value={m.id}
                                                                />
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={(e) => {
                                                                        if (
                                                                            !confirm(
                                                                                'Delete this method?'
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
