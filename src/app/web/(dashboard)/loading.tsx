export default function DashboardLoading(): React.ReactElement {
    return (
        <div
            role="status"
            aria-label="Loading dashboard"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '2rem',
                fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                color: '#5a6d92',
            }}
        >
            <div
                style={{
                    height: 16,
                    width: '40%',
                    background: 'rgba(13, 15, 45, 0.08)',
                    borderRadius: 4,
                    animation: 'tlx-pulse 1.4s ease-in-out infinite',
                }}
            />
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                }}
            >
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            height: 120,
                            background: 'rgba(13, 15, 45, 0.06)',
                            borderRadius: 8,
                            animation: 'tlx-pulse 1.4s ease-in-out infinite',
                            animationDelay: `${i * 0.12}s`,
                        }}
                    />
                ))}
            </div>
            <style>{`
        @keyframes tlx-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
