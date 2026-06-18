'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[app] unhandled error:', error);
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
        minHeight: '60vh',
        padding: '2rem',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        color: 'var(--color-ink, #1a237e)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2.25rem', margin: 0 }}>Something went wrong</h1>
      <p style={{ maxWidth: 480, marginTop: '0.75rem', color: 'var(--color-muted, #5a6d92)' }}>
        An unexpected error occurred while loading this page. You can try again, or head back to the
        homepage.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '0.65rem 1.4rem',
            background: 'var(--color-accent, #0cf293)',
            color: 'var(--color-ink, #1a237e)',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: '0.65rem 1.4rem',
            background: 'transparent',
            color: 'var(--color-ink, #1a237e)',
            border: '1px solid var(--color-ink, #1a237e)',
            borderRadius: 4,
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
