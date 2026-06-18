import Link from 'next/link';

const links = [
  { href: '/web/dashboard', label: 'Dashboard' },
  { href: '/web/hub', label: 'Hub' },
  { href: '/web/plan', label: 'Plans' },
  { href: '/web/tickets', label: 'Tickets' },
  { href: '/web/giftcards', label: 'Gift Cards' },
  { href: '/web/affiliate', label: 'Affiliate' },
  { href: '/web/wheel', label: 'Wheel' },
] as const;

export default function DashHeader({ userName }: { userName: string }): React.ReactElement {
  return (
    <header className="topbar" data-navbarbg="skin6">
      <nav className="navbar top-navbar navbar-dark">
        <div className="navbar-header" data-logobg="skin6">
          <a className="nav-toggler waves-effect waves-dark d-block d-md-none" href="javascript:void(0)">
            <i className="ti-menu ti-close" />
          </a>
          <Link href="/web/dashboard" className="navbar-brand">
            <span className="logo-icon text-center">
              <img src="/images/logo-icon.png" alt="IPstress" className="dark-logo" />
            </span>
            <span className="text-center text-white brand-text">IPstress</span>
          </Link>
        </div>
        <div className="navbar-collapse collapse" id="navbarSupportedContent">
          <ul className="navbar-nav float-left mr-auto ml-3 pl-1" aria-label="Dashboard sections">
            {links.map(l => (
              <li className="nav-item" key={l.href}>
                <Link className="nav-link" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="navbar-nav float-right">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="javascript:void(0)" data-toggle="dropdown">
                <img src="/images/logo-icon.png" alt="" className="dark-logo" width={29} />
                <span className="ml-2 d-none d-lg-inline-block">
                  <span className="text-dark">Hello, {userName}!</span>
                </span>
              </a>
              <div className="dropdown-menu dropdown-menu-right user-dd animated flipInY">
                <Link className="dropdown-item" href="/web/tickets">Inbox</Link>
                <Link className="dropdown-item" href="/web/profile">Profile</Link>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="/web/api/auth/logout">Logout</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
