'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Ticket {
    id: number;
    subject: string;
    status: string;
    date: number;
}

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/web/api/tickets')
            .then((r) => r.json())
            .then((data) => {
                setTickets(data.tickets || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Support Tickets
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql" aria-current="page">
                                    IPstress
                                </li>
                                <li className="breadcrumb-item text-muted" aria-current="page">
                                    Tickets
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
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="card-title">My Tickets</h4>
                                    <Link href="/web/tickets/new" className="btn btn-primary">
                                        New Ticket
                                    </Link>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Subject</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="text-center text-muted"
                                                    >
                                                        Loading tickets...
                                                    </td>
                                                </tr>
                                            ) : tickets.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="text-center text-muted"
                                                    >
                                                        No tickets found.
                                                    </td>
                                                </tr>
                                            ) : (
                                                tickets.map((t) => (
                                                    <tr key={t.id}>
                                                        <td>{t.id}</td>
                                                        <td>{t.subject}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${
                                                                    t.status ===
                                                                    'Waiting for admin response'
                                                                        ? 'badge-warning'
                                                                        : t.status === 'Closed'
                                                                          ? 'badge-secondary'
                                                                          : 'badge-success'
                                                                }`}
                                                            >
                                                                {t.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {new Date(
                                                                t.date * 1000
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td>
                                                            <Link
                                                                href={`/web/tickets/${t.id}`}
                                                                className="btn btn-sm btn-info"
                                                            >
                                                                View
                                                            </Link>
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
