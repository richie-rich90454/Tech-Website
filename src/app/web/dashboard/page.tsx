import { webDb } from '@/lib/db/web';

export default async function DashboardPage() {
  const now = Math.floor(Date.now() / 1000);

  const [
    totalUsers,
    totalAttacks,
    runningAttacks,
    totalPaidUsers,
    newsItems,
    recentLogs,
  ] = await Promise.all([
    webDb.users.count(),
    webDb.logs.count(),
    webDb.logs.count({
      where: {
        stopped: 0,
        date: { lte: now },
        AND: [
          { time: { not: 0 } },
        ],
      },
    }),
    webDb.users.count({
      where: { membership: { not: 0 } },
    }),
    webDb.news.findMany({
      orderBy: { date: 'desc' },
      take: 5,
    }),
    webDb.logs.findMany({
      orderBy: { date: 'desc' },
      take: 10,
      where: {
        stopped: 0,
      },
    }),
  ]);

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Dashboard</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql" aria-current="page">IPstress</li>
                <li className="breadcrumb-item text-muted" aria-current="page">Dashboard</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        {/* Stats Row */}
        <div className="card-group">
          <div className="card border-right">
            <div className="card-body">
              <div className="d-flex d-lg-flex d-md-block align-items-center">
                <div>
                  <div className="d-inline-flex align-items-center">
                    <h2 className="text-white mb-1 font-weight-medium">{totalUsers}</h2>
                  </div>
                  <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate mb-2">Total Users</h6>
                </div>
                <div className="ml-auto mt-md-3 mt-lg-0">
                  <span className="opacity-7 text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                  </span>
                </div>
              </div>
              <div className="progress progress-md">
                <div className="progress-bar bg-purple" role="progressbar" style={{ width: `${Math.min(totalUsers, 100)}%` }}></div>
              </div>
            </div>
          </div>
          <div className="card border-right">
            <div className="card-body">
              <div className="d-flex d-lg-flex d-md-block align-items-center">
                <div>
                  <div className="d-inline-flex align-items-center">
                    <h2 className="text-white mb-1 font-weight-medium">{totalAttacks}</h2>
                  </div>
                  <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate mb-2">Total Attacks</h6>
                </div>
                <div className="ml-auto mt-md-3 mt-lg-0">
                  <span className="opacity-7 text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                  </span>
                </div>
              </div>
              <div className="progress progress-md">
                <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${Math.min(totalAttacks, 100)}%` }}></div>
              </div>
            </div>
          </div>
          <div className="card border-right">
            <div className="card-body">
              <div className="d-flex d-lg-flex d-md-block align-items-center">
                <div>
                  <div className="d-inline-flex align-items-center">
                    <h2 className="text-white mb-1 font-weight-medium">{runningAttacks}</h2>
                  </div>
                  <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate mb-2">Running Attacks</h6>
                </div>
                <div className="ml-auto mt-md-3 mt-lg-0">
                  <span className="opacity-7 text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  </span>
                </div>
              </div>
              <div className="progress progress-md">
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${Math.min(runningAttacks, 100)}%` }}></div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="d-flex d-lg-flex d-md-block align-items-center">
                <div>
                  <h2 className="text-white mb-1 font-weight-medium">{totalPaidUsers}</h2>
                  <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate mb-2">Active Users</h6>
                </div>
                <div className="ml-auto mt-md-3 mt-lg-0">
                  <span className="opacity-7 text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                  </span>
                </div>
              </div>
              <div className="progress progress-md">
                <div className="progress-bar bg-success" role="progressbar" style={{ width: `${Math.min(totalPaidUsers, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* News / Announcements */}
          <div className="col-md-6 col-lg-7">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Announcements</h4>
                <div className="mt-4 activity">
                  <div className="col-lg-12">
                    {newsItems.length === 0 ? (
                      <p className="text-muted">No announcements yet.</p>
                    ) : (
                      newsItems.map((item) => (
                        <div key={item.ID} className="d-flex align-items-start border-left-line pb-3">
                          <div>
                            <a href="javascript:void(0)" className="btn btn-purple btn-circle mb-2 btn-item">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                            </a>
                          </div>
                          <div className="ml-3 mt-2">
                            <h5 className="text-white font-weight-medium mb-2">{item.title}</h5>
                            <p className="font-14 mb-2 text-muted">{item.content}</p>
                            <span className="font-weight-light font-14 text-muted">IPstress {item.date}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Attack Form */}
          <div className="col-md-6 col-lg-5">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Quick Attack</h4>
                <div className="mt-4 activity">
                  <form action="/web/api/hub" method="POST">
                    <div className="form-group">
                      <label className="text-white" htmlFor="host">Host</label>
                      <input className="form-control" id="host" name="host" type="text" placeholder="Enter target host" required />
                    </div>
                    <div className="form-group">
                      <label className="text-white" htmlFor="port">Port</label>
                      <input className="form-control" id="port" name="port" type="text" placeholder="80" defaultValue="80" />
                    </div>
                    <div className="form-group">
                      <label className="text-white" htmlFor="time">Time (seconds)</label>
                      <select className="form-control" id="time" name="time">
                        <option value="30">30s</option>
                        <option value="60">60s</option>
                        <option value="120">120s</option>
                        <option value="180">180s</option>
                        <option value="300">300s</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="text-white" htmlFor="method">Method</label>
                      <select className="form-control" id="method" name="method">
                        <option value="UDP">UDP</option>
                        <option value="TCP">TCP</option>
                        <option value="STOP">STOP</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">Launch Attack</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Running Attacks Table */}
        <div className="row">
          <div className="col-md-12 col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Running Attacks</h4>
                <div className="table-responsive mt-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Target</th>
                        <th>Port</th>
                        <th>Method</th>
                        <th>Time</th>
                        <th>Started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted">No running attacks.</td>
                        </tr>
                      ) : (
                        recentLogs.map((log) => (
                          <tr key={log.id}>
                            <td>{log.ip}</td>
                            <td>{log.postdata || '-'}</td>
                            <td>{log.method}</td>
                            <td>{log.time}s</td>
                            <td>{new Date(log.date * 1000).toLocaleString()}</td>
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