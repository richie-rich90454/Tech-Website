export default function TllLoading(): React.ReactElement {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        padding: '2rem',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        color: 'var(--color-ink, #1a237e)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(26, 35, 126, 0.18)',
          borderTopColor: 'var(--color-accent, #0cf293)',
          borderRadius: '50%',
          animation: 'tlx-spin 0.9s linear infinite',
        }}
      />
      <p style={{ marginTop: '0.9rem', color: 'var(--color-muted, #5a6d92)', fontSize: '0.9rem' }}>
        Loading tip list…
      </p>
      <style>{`@keyframes tlx-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
