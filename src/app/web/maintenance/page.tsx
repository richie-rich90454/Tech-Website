import Link from 'next/link';
import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
    const settings = await webDb.settings.findFirst();
    const message =
        settings?.description ||
        'We are currently performing maintenance. Please check back later.';

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#0a0e27',
                color: '#fff',
                textAlign: 'center',
            }}
        >
            <div>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛠 Maintenance Mode</h1>
                <p style={{ fontSize: '1.2rem', maxWidth: '600px' }}>{message}</p>
                <Link
                    href="/web/"
                    style={{ color: '#0cf293', marginTop: '2rem', display: 'inline-block' }}
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
