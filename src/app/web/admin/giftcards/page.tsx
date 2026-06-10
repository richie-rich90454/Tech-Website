import { webDb } from '@/lib/db/web';

export default async function AdminGiftCardsPage() {
  const giftcards = await webDb.giftcards.findMany({
    orderBy: { date: 'desc' },
    select: { ID: true, code: true, planID: true, claimedby: true, dateClaimed: true, date: true },
  });

  const plans = await webDb.plans.findMany({ select: { ID: true, name: true } });
  const planMap = new Map(plans.map((p) => [p.ID, p.name]));

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Gift Cards</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql">IPstress</li>
                <li className="breadcrumb-item text-muted">Gift Cards</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Generate Codes</h4>
                <form method="POST" action="/web/api/admin/giftcards" className="mt-4">
                  <input type="hidden" name="action" value="generate" />
                  <div className="form-group">
                    <label className="text-white">Plan</label>
                    <select className="form-control" name="planID" required>
                      <option value="">Select a plan...</option>
                      {plans.map((p) => (
                        <option key={p.ID} value={p.ID}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="text-white">Number of codes</label>
                    <input className="form-control" name="count" type="number" defaultValue="1" min="1" max="100" required />
                  </div>
                  <button type="submit" className="btn btn-success">Generate</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">All Gift Cards</h4>
                <div className="table-responsive mt-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Code</th>
                        <th>Plan</th>
                        <th>Claimed By</th>
                        <th>Created</th>
                        <th>Claimed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {giftcards.length === 0 ? (
                        <tr><td colSpan={6} className="text-center text-muted">No gift cards yet.</td></tr>
                      ) : (
                        giftcards.map((g) => (
                          <tr key={g.ID}>
                            <td>{g.ID}</td>
                            <td><code>{g.code}</code></td>
                            <td>{planMap.get(g.planID) || '-'}</td>
                            <td>{g.claimedby ? 'Yes' : 'No'}</td>
                            <td>{new Date(g.date * 1000).toLocaleDateString()}</td>
                            <td>{g.dateClaimed ? new Date(g.dateClaimed * 1000).toLocaleDateString() : '-'}</td>
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