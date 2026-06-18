'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function WebLandingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): React.ReactElement {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[web] unhandled error:', error);
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
        minHeight: '70vh',
        padding: '2rem',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        color: '#e5f4ff',
        background: 'linear-gradient(135deg, #06092c 0%, #0d0f2d 50%, #101230 100%)',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '2rem', margin: 0 }}>Something went wrong</h1>
      <p style={{ maxWidth: 480, marginTop: '0.75rem', color: 'rgba(229, 244, 255, 0.6)' }}>
        We couldn’t load the IPstress landing page. Please try again.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '0.65rem 1.4rem',
            background: '#17d984',
            color: '#06092c',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <Link
          href="/web"
          style={{
            padding: '0.65rem 1.4rem',
            background: 'transparent',
            color: '#e5f4ff',
            border: '1px solid #e5f4ff',
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
