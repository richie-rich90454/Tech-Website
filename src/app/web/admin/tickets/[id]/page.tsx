import { webDb } from '@/lib/db/web';
import { notFound } from 'next/navigation';

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticketId = parseInt(id);
  if (isNaN(ticketId)) return notFound();

  const [ticket, messages] = await Promise.all([
    webDb.tickets.findUnique({ where: { id: ticketId } }),
    webDb.messages.findMany({
      where: { ticketid: ticketId },
      orderBy: { date: 'asc' },
    }),
  ]);

  if (!ticket) return notFound();

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Ticket #{ticket.id}</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql">IPstress</li>
                <li className="breadcrumb-item text-muted"><a href="/web/admin/tickets">Tickets</a></li>
                <li className="breadcrumb-item text-muted">#{ticket.id}</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{ticket.subject}</h4>
                <p className="text-muted">
                  By <strong>{ticket.username}</strong> | {new Date(ticket.date * 1000).toLocaleString()} | Status: <span className={`badge ${ticket.status === 'Closed' ? 'badge-secondary' : 'badge-warning'}`}>{ticket.status}</span>
                </p>
                <hr />
                <div className="mb-4">
                  <h6>Original Message:</h6>
                  <p className="text-white">{ticket.content}</p>
                </div>
                <hr />
                <h6>Replies:</h6>
                {messages.length === 0 ? (
                  <p className="text-muted">No replies yet.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.messageid} className="mb-3 p-3" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                      <p className="text-muted mb-1"><strong>{m.sender}</strong> - {new Date(m.date * 1000).toLocaleString()}</p>
                      <p className="text-white mb-0">{m.content}</p>
                    </div>
                  ))
                )}
                <hr />
                <form method="POST" action="/web/api/admin/tickets">
                  <input type="hidden" name="action" value="reply" />
                  <input type="hidden" name="id" value={ticket.id} />
                  <div className="form-group">
                    <label className="text-white">Reply</label>
                    <textarea className="form-control" name="content" rows={4} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Send Reply</button>
                </form>
                {ticket.status !== 'Closed' && (
                  <form method="POST" action="/web/api/admin/tickets" className="mt-2">
                    <input type="hidden" name="action" value="close" />
                    <input type="hidden" name="id" value={ticket.id} />
                    <button type="submit" className="btn btn-secondary">Close Ticket</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}