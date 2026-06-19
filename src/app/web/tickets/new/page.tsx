'use client';
import { useState } from 'react';

export default function NewTicketPage() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            const res = await fetch('/web/api/tickets', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Ticket created successfully!');
                form.reset();
            } else {
                setError(data.error || 'Failed to create ticket.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        New Ticket
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql" aria-current="page">
                                    IPstress
                                </li>
                                <li className="breadcrumb-item text-muted" aria-current="page">
                                    New Ticket
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
                                <h4 className="card-title">Create Support Ticket</h4>
                                {error && <div className="alert alert-danger">{error}</div>}
                                {success && <div className="alert alert-success">{success}</div>}
                                <div className="mt-4 activity">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="subject">
                                                Subject
                                            </label>
                                            <input
                                                className="form-control"
                                                id="subject"
                                                name="subject"
                                                type="text"
                                                placeholder="Enter ticket subject"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="content">
                                                Message
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="content"
                                                name="content"
                                                rows={6}
                                                placeholder="Describe your issue..."
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block"
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Submitting...' : 'Create Ticket'}
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
