import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      {/* 
    __         __  __
   / /_  _____/ /_/ /_____
  / __ \/ ___/ __/ __/ __ \
 / /_/ / /__/ /_/ /_/ /_/ /
/_.___/\___/\__/\__/\____/
richie-rich90454 · June 2026
*/}
      <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Page Not Found</p>
      <Link href="/" style={{ padding: '0.75rem 2rem', background: '#1a237e', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>Go Home</Link>
    </div>
  );
}