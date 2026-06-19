import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ticketId = parseInt(id, 10);

    const ticket = await webDb.tickets.findUnique({
        where: { id: ticketId },
    });

    if (!ticket) {
        return (
            <>
                <div className="page-breadcrumb">
                    <div className="d-flex align-items-center">
                        <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                            Ticket Not Found
                        </h4>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body">
                                    <p className="text-muted">
                                        The requested ticket does not exist.
                                    </p>
                                    <a href="/web/tickets" className="btn btn-primary">
                                        Back to Tickets
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const messages = await webDb.messages.findMany({
        where: { ticketid: ticket.id },
        orderBy: { date: 'asc' },
    });

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Ticket #{ticket.id}
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql" aria-current="page">
                                    IPstress
                                </li>
                                <li className="breadcrumb-item text-muted" aria-current="page">
                                    Ticket #{ticket.id}
                                </li>
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
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h4 className="card-title mb-1">{ticket.subject}</h4>
                                        <span
                                            className={`badge ${
                                                ticket.status === 'Waiting for admin response'
                                                    ? 'badge-warning'
                                                    : ticket.status === 'Closed'
                                                      ? 'badge-secondary'
                                                      : 'badge-success'
                                            }`}
                                        >
                                            {ticket.status}
                                        </span>
                                        <span className="text-muted ml-2">
                                            Created: {new Date(ticket.date * 1000).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Initial message */}
                                <div className="card bg-dark mb-3">
                                    <div className="card-body">
                                        <div className="d-flex">
                                            <div>
                                                <h6 className="text-white mb-1">
                                                    {ticket.username}
                                                </h6>
                                                <p
                                                    className="text-muted mb-0"
                                                    style={{ whiteSpace: 'pre-wrap' }}
                                                >
                                                    {ticket.content}
                                                </p>
                                                <small className="text-muted">
                                                    {new Date(ticket.date * 1000).toLocaleString()}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reply messages */}
                                {messages.map((msg) => (
                                    <div key={msg.messageid} className="card bg-dark mb-3">
                                        <div className="card-body">
                                            <div className="d-flex">
                                                <div>
                                                    <h6 className="text-white mb-1">
                                                        {msg.sender}
                                                    </h6>
                                                    <p
                                                        className="text-muted mb-0"
                                                        style={{ whiteSpace: 'pre-wrap' }}
                                                    >
                                                        {msg.content}
                                                    </p>
                                                    <small className="text-muted">
                                                        {new Date(msg.date * 1000).toLocaleString()}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Reply form */}
                                {ticket.status !== 'Closed' && (
                                    <div className="card bg-dark">
                                        <div className="card-body">
                                            <h5 className="text-white mb-3">Reply</h5>
                                            <form
                                                action={`/web/api/tickets/${ticket.id}`}
                                                method="POST"
                                            >
                                                <div className="form-group">
                                                    <textarea
                                                        className="form-control"
                                                        name="content"
                                                        rows={4}
                                                        placeholder="Type your reply..."
                                                        required
                                                    />
                                                </div>
                                                <button type="submit" className="btn btn-primary">
                                                    Send Reply
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-3">
                                    <a href="/web/tickets" className="btn btn-secondary">
                                        Back to Tickets
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
