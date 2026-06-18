import Link from 'next/link';

const links = [
  { href: '/web', label: 'Home' },
  { href: '/web#about', label: 'About' },
  { href: '/web#plans', label: 'Plans' },
  { href: '/web#faq', label: 'FAQ' },
] as const;

export default function WebHeader(): React.ReactElement {
  return (
    <header className="web-header">
      <div className="web-header__inner">
        <Link href="/web" className="web-header__brand" aria-label="IPstress — home">
          <span className="web-header__mark" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
            </svg>
          </span>
          <span className="web-header__name">IPstress</span>
        </Link>

        <nav className="web-header__nav" aria-label="Primary">
          <ul>
            {links.map(l => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="web-header__cta">
          <Link href="/web/register" className="web-header__btn web-header__btn--ghost">
            Register
          </Link>
          <Link href="/web/login" className="web-header__btn web-header__btn--solid">
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
}
