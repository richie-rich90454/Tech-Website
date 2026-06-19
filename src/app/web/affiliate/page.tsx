'use client';
import { useState, useEffect } from 'react';

interface AffiliateStats {
    referralLink: string;
    referralCount: number;
    referralBalance: number;
}

export default function AffiliatePage() {
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [withdrawMethod, setWithdrawMethod] = useState('');
    const [withdrawAddress, setWithdrawAddress] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetch('/web/api/affiliate')
            .then((r) => r.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');
        setIsError(false);

        try {
            const formData = new FormData();
            formData.append('paymentMethod', withdrawMethod);
            formData.append('paymentAddress', withdrawAddress);
            formData.append('amount', withdrawAmount);

            const res = await fetch('/web/api/affiliate/withdraw', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.success || 'Withdrawal request submitted!');
                setIsError(false);
                setWithdrawMethod('');
                setWithdrawAddress('');
                setWithdrawAmount('');
            } else {
                setMessage(data.error || 'Failed to submit withdrawal.');
                setIsError(true);
            }
        } catch {
            setMessage('Network error. Please try again.');
            setIsError(true);
        } finally {
            setSubmitting(false);
        }
    };

    const copyReferralLink = () => {
        if (stats?.referralLink) {
            navigator.clipboard.writeText(stats.referralLink).catch(() => {});
        }
    };

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Affiliate
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql" aria-current="page">
                                    IPstress
                                </li>
                                <li className="breadcrumb-item text-muted" aria-current="page">
                                    Affiliate
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    {/* Stats Card */}
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Affiliate Stats</h4>
                                <div className="mt-4 activity">
                                    {loading ? (
                                        <p className="text-muted">Loading stats...</p>
                                    ) : !stats ? (
                                        <p className="text-muted">Stats not available.</p>
                                    ) : (
                                        <>
                                            <div className="form-group">
                                                <label className="text-white">Referral Link</label>
                                                <div className="input-group">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        readOnly
                                                        value={stats.referralLink}
                                                    />
                                                    <div className="input-group-append">
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            type="button"
                                                            onClick={copyReferralLink}
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="text-white">Referrals</label>
                                                <p className="text-white font-weight-medium">
                                                    {stats.referralCount}
                                                </p>
                                            </div>
                                            <div className="form-group">
                                                <label className="text-white">Balance</label>
                                                <p className="text-white font-weight-medium">
                                                    {stats.referralBalance}¥
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Withdraw Card */}
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Withdraw Balance</h4>
                                {message && (
                                    <div
                                        className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}
                                    >
                                        {message}
                                    </div>
                                )}
                                <div className="mt-4 activity">
                                    <form onSubmit={handleWithdraw}>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="paymentMethod">
                                                Payment Method
                                            </label>
                                            <select
                                                className="form-control"
                                                id="paymentMethod"
                                                value={withdrawMethod}
                                                onChange={(e) => setWithdrawMethod(e.target.value)}
                                                required
                                            >
                                                <option value="">Select method...</option>
                                                <option value="BTC">Bitcoin (BTC)</option>
                                                <option value="LTC">Litecoin (LTC)</option>
                                                <option value="ETH">Ethereum (ETH)</option>
                                                <option value="PayPal">PayPal</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="paymentAddress">
                                                Payment Address
                                            </label>
                                            <input
                                                className="form-control"
                                                id="paymentAddress"
                                                type="text"
                                                placeholder="Enter your wallet address or email"
                                                value={withdrawAddress}
                                                onChange={(e) => setWithdrawAddress(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-white" htmlFor="amount">
                                                Amount (¥)
                                            </label>
                                            <input
                                                className="form-control"
                                                id="amount"
                                                type="number"
                                                placeholder="Enter amount to withdraw"
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block"
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Submitting...' : 'Request Withdrawal'}
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
