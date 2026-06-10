import { webDb } from '@/lib/db/web';

export default async function AdminPlansPage() {
  const plans = await webDb.plans.findMany({ orderBy: { ID: 'asc' } });

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Plan Management</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql">IPstress</li>
                <li className="breadcrumb-item text-muted">Plans</li>
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
                <h4 className="card-title">Create Plan</h4>
                <form method="POST" action="/web/api/admin/plans" className="mt-4">
                  <input type="hidden" name="action" value="create" />
                  <div className="form-group">
                    <label className="text-white">Name</label>
                    <input className="form-control" name="name" required />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Max Boot Time (seconds)</label>
                    <input className="form-control" name="mbt" type="number" defaultValue="60" required />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Unit</label>
                    <input className="form-control" name="unit" defaultValue="seconds" />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Length (days)</label>
                    <input className="form-control" name="length" type="number" defaultValue="30" required />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Price</label>
                    <input className="form-control" name="price" type="number" step="0.01" defaultValue="10" required />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Concurrents</label>
                    <input className="form-control" name="concurrents" type="number" defaultValue="1" required />
                  </div>
                  <div className="form-group">
                    <label className="text-white">VIP</label>
                    <select className="form-control" name="vip" defaultValue="0">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="text-white">Private</label>
                    <select className="form-control" name="private" defaultValue="0">
                      <option value="0">No</option>
                      <option value="1">Yes</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success">Create Plan</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">All Plans</h4>
                <div className="table-responsive mt-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>MBT</th>
                        <th>Price</th>
                        <th>Length</th>
                        <th>Conc</th>
                        <th>VIP</th>
                        <th>Private</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.length === 0 ? (
                        <tr><td colSpan={9} className="text-center text-muted">No plans yet.</td></tr>
                      ) : (
                        plans.map((p) => (
                          <tr key={p.ID}>
                            <td>{p.ID}</td>
                            <td>{p.name}</td>
                            <td>{p.mbt}s</td>
                            <td>${p.price}</td>
                            <td>{p.length}d</td>
                            <td>{p.concurrents}</td>
                            <td>{p.vip ? 'Yes' : 'No'}</td>
                            <td>{p.private ? 'Yes' : 'No'}</td>
                            <td>
                              <form method="POST" action="/web/api/admin/plans" style={{ display: 'inline' }}>
                                <input type="hidden" name="action" value="delete" />
                                <input type="hidden" name="id" value={p.ID} />
                                <button type="submit" className="btn btn-sm btn-danger" onClick={(e) => { if (!confirm('Delete this plan?')) e.preventDefault(); }}>
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