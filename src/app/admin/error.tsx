'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}): React.ReactElement {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[admin] unhandled error:', error);
        }
    }, [error]);

    return (
        <div
            role="alert"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                padding: '2rem',
                fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                color: '#1a237e',
                textAlign: 'center',
            }}
        >
            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Admin panel error</h1>
            <p style={{ maxWidth: 460, marginTop: '0.6rem', color: '#5a6d92' }}>
                Something went wrong while loading this view. Please retry.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
                <button
                    type="button"
                    onClick={reset}
                    style={{
                        padding: '0.55rem 1.2rem',
                        background: '#0cf293',
                        color: '#1a237e',
                        border: 'none',
                        borderRadius: 4,
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Try again
                </button>
                <Link
                    href="/admin"
                    style={{
                        padding: '0.55rem 1.2rem',
                        background: 'transparent',
                        color: '#1a237e',
                        border: '1px solid #1a237e',
                        borderRadius: 4,
                        textDecoration: 'none',
                        fontWeight: 500,
                    }}
                >
                    Home
                </Link>
            </div>
        </div>
    );
}
