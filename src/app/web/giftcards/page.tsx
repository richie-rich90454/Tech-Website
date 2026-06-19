'use client';
import { useState, useEffect } from 'react';

interface GiftCard {
    ID: number;
    code: string;
    claimedby: number;
    dateClaimed: number;
    date: number;
}

export default function GiftCardsPage() {
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleRedeem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');
        setIsError(false);

        try {
            const formData = new FormData();
            formData.append('code', code);

            const res = await fetch('/web/api/giftcards/redeem', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.success || 'Gift card redeemed successfully!');
                setIsError(false);
                setCode('');
            } else {
                setMessage(data.error || 'Failed to redeem gift card.');
                setIsError(true);
            }
        } catch {
            setMessage('Network error. Please try again.');
            setIsError(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Gift Cards
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql" aria-current="page">
                                    IPstress
                                </li>
                                <li className="breadcrumb-item text-muted" aria-current="page">
                                    Gift Cards
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
                                <h4 className="card-title">Redeem Gift Card</h4>
                                {message && (
                                    <div
                                        className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}
                                    >
                                        {message}
                                    </div>
                                )}
                                <div className="mt-4 activity">
                                    <form onSubmit={handleRedeem}>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="code">
                                                Gift Card Code
                                            </label>
                                            <input
                                                className="form-control"
                                                id="code"
                                                type="text"
                                                placeholder="Enter your gift card code"
                                                value={code}
                                                onChange={(e) => setCode(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block"
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Redeeming...' : 'Redeem'}
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
