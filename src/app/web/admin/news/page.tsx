import { webDb } from '@/lib/db/web';

export default async function AdminNewsPage() {
  const news = await webDb.news.findMany({ orderBy: { ID: 'desc' } });

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">News Management</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql">IPstress</li>
                <li className="breadcrumb-item text-muted">News</li>
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
                <h4 className="card-title">Create Announcement</h4>
                <form method="POST" action="/web/api/admin/news" className="mt-4">
                  <input type="hidden" name="action" value="create" />
                  <div className="form-group">
                    <label className="text-white">Title</label>
                    <input className="form-control" name="title" required />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Content</label>
                    <textarea className="form-control" name="content" rows={4} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-success">Publish</button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">All Announcements</h4>
                <div className="table-responsive mt-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {news.length === 0 ? (
                        <tr><td colSpan={4} className="text-center text-muted">No announcements yet.</td></tr>
                      ) : (
                        news.map((n) => (
                          <tr key={n.ID}>
                            <td>{n.ID}</td>
                            <td>{n.title}</td>
                            <td>{n.date}</td>
                            <td>
                              <form method="POST" action="/web/api/admin/news" style={{ display: 'inline' }}>
                                <input type="hidden" name="action" value="delete" />
                                <input type="hidden" name="id" value={n.ID} />
                                <button type="submit" className="btn btn-sm btn-danger" onClick={(e) => { if (!confirm('Delete this announcement?')) e.preventDefault(); }}>
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