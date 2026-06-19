export default function WebLandingLoading(): React.ReactElement {
    return (
        <div
            role="status"
            aria-label="Loading"
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
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    border: '3px solid rgba(229, 244, 255, 0.18)',
                    borderTopColor: '#17d984',
                    borderRadius: '50%',
                    animation: 'tlx-spin 0.9s linear infinite',
                }}
            />
            <p
                style={{
                    marginTop: '1rem',
                    color: 'rgba(229, 244, 255, 0.6)',
                    fontSize: '0.95rem',
                }}
            >
                Loading…
            </p>
            <style>{`@keyframes tlx-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
