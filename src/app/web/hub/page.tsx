import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function HubPage() {
    const [methods, servers] = await Promise.all([
        webDb.methods.findMany({
            select: { id: true, name: true, fullname: true },
            orderBy: { name: 'asc' },
        }),
        webDb.api.findMany({
            select: { id: true, name: true, slots: true },
            orderBy: { name: 'asc' },
        }),
    ]);

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Attack Hub
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql" aria-current="page">
                                    IPstress
                                </li>
                                <li className="breadcrumb-item text-muted" aria-current="page">
                                    Hub
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-8 col-lg-6 mx-auto">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Launch Attack</h4>
                                <div className="mt-4 activity">
                                    <form action="/web/api/hub" method="POST">
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="host">
                                                Host
                                            </label>
                                            <input
                                                className="form-control"
                                                id="host"
                                                name="host"
                                                type="text"
                                                placeholder="Enter target IP or hostname"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="port">
                                                Port
                                            </label>
                                            <input
                                                className="form-control"
                                                id="port"
                                                name="port"
                                                type="text"
                                                placeholder="80"
                                                defaultValue="80"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="time">
                                                Time (seconds)
                                            </label>
                                            <select className="form-control" id="time" name="time">
                                                <option value="30">30 seconds</option>
                                                <option value="60">60 seconds</option>
                                                <option value="120">120 seconds</option>
                                                <option value="180">180 seconds</option>
                                                <option value="300">300 seconds</option>
                                                <option value="600">600 seconds</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="method">
                                                Method
                                            </label>
                                            <select
                                                className="form-control"
                                                id="method"
                                                name="method"
                                            >
                                                {methods.length === 0 ? (
                                                    <option value="">No methods available</option>
                                                ) : (
                                                    methods.map((m) => (
                                                        <option key={m.id} value={m.name}>
                                                            {m.fullname || m.name}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="server">
                                                Server
                                            </label>
                                            <select
                                                className="form-control"
                                                id="server"
                                                name="server"
                                            >
                                                {servers.length === 0 ? (
                                                    <option value="">No servers available</option>
                                                ) : (
                                                    servers.map((s) => (
                                                        <option key={s.id} value={s.name}>
                                                            {s.name} ({s.slots} slots)
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-danger btn-block btn-lg"
                                        >
                                            Start Attack
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
