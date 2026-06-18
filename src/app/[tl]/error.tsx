'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function TllError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[tl] unhandled error:', error);
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
        color: 'var(--color-ink, #1a237e)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Couldn’t load this section</h1>
      <p style={{ maxWidth: 460, marginTop: '0.75rem', color: 'var(--color-muted, #5a6d92)' }}>
        We hit a snag fetching the tech tips. Give it another try.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '0.6rem 1.25rem',
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
            padding: '0.6rem 1.25rem',
            background: 'transparent',
            color: 'var(--color-ink, #1a237e)',
            border: '1px solid var(--color-ink, #1a237e)',
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
