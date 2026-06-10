import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function AdminHubPage() {
  const methods = await webDb.methods.findMany({
    select: { id: true, name: true, fullname: true, type: true },
    orderBy: { type: 'asc' },
  });

  const l4 = methods.filter((m) => m.type === 'layer4');
  const l7 = methods.filter((m) => m.type === 'layer7');

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Admin Hub</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql">IPstress</li>
                <li className="breadcrumb-item text-muted">Admin Hub</li>
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
                <h4 className="card-title">Admin Attack Launcher</h4>
                <p className="text-muted">No cooldown. No limits. Admin-only.</p>
                <form method="POST" action="/web/api/admin/hub" className="mt-4">
                  <div className="form-group">
                    <label className="text-white" htmlFor="host">Host</label>
                    <input className="form-control" id="host" name="host" type="text" placeholder="1.1.1.1 or http://link.com" required />
                  </div>
                  <div className="form-group">
                    <label className="text-white" htmlFor="port">Port</label>
                    <input className="form-control" id="port" name="port" type="text" placeholder="80" defaultValue="80" />
                  </div>
                  <div className="form-group">
                    <label className="text-white" htmlFor="time">Time (Seconds)</label>
                    <input className="form-control" id="time" name="time" type="number" placeholder="30" defaultValue="30" required />
                  </div>
                  <div className="form-group">
                    <label className="text-white" htmlFor="method">Method</label>
                    <select className="form-control" id="method" name="method" required>
                      <optgroup label="Layer 4 Methods">
                        {l4.map((m) => (
                          <option key={m.id} value={m.name}>{m.fullname}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Layer 7 Methods">
                        {l7.map((m) => (
                          <option key={m.id} value={m.name}>{m.fullname}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="text-white" htmlFor="servers">Servers</label>
                    <select className="form-control" id="servers" name="servers">
                      <option value="vip">VIP Servers</option>
                      <option value="normal">Normal Servers</option>
                      <option value="all">Total Network</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success btn-block btn-lg">
                    Start Attack
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}