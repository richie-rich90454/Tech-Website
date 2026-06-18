export default function AdminLoading(): React.ReactElement {
  return (
    <div
      role="status"
      aria-label="Loading admin"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '2rem',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
      }}
    >
      <div
        style={{
          height: 20,
          width: '30%',
          background: 'rgba(26, 35, 126, 0.12)',
          borderRadius: 4,
          animation: 'tlx-pulse 1.4s ease-in-out infinite',
        }}
      />
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            height: 44,
            background: 'rgba(26, 35, 126, 0.06)',
            borderRadius: 4,
            animation: 'tlx-pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
      <style>{`@keyframes tlx-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}
