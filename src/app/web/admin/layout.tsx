'use client';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  useEffect(() => {
    // Vanilla dropdown toggle (replaces Bootstrap data-toggle="dropdown")
    document.querySelectorAll('[data-toggle="dropdown"]').forEach(el => {
      el.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const parent = el.closest('.dropdown');
        if (!parent) return;
        const menu = parent.querySelector('.dropdown-menu') as HTMLElement;
        if (menu) {
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }
        const closeHandler = (ev: MouseEvent) => {
          if (!parent.contains(ev.target as Node)) {
            if (menu) menu.style.display = 'none';
            document.removeEventListener('click', closeHandler);
          }
        };
        if (menu?.style.display === 'block') {
          setTimeout(() => document.addEventListener('click', closeHandler), 0);
        }
      });
    });

    // Mobile sidebar toggle
    const navToggler = document.querySelector('.nav-toggler');
    const sidebar = document.querySelector('.left-sidebar');
    navToggler?.addEventListener('click', function (e) {
      e.preventDefault();
      sidebar?.classList.toggle('open');
    });
  }, []);
  return (
    <>
      {/* web admin · richie-rich90454 · June 2026 */}
      <div className="preloader">
        <div className="lds-ripple">
          <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
      <div id="main-wrapper" data-theme="dark" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed" data-boxed-layout="full">
        {/* Header */}
        <header className="topbar" data-navbarbg="skin6">
          <nav className="navbar top-navbar navbar-dark">
            <div className="navbar-header" data-logobg="skin6">
              <a className="nav-toggler waves-effect waves-dark d-block d-md-none" href="javascript:void(0)">
                <i className="ti-menu ti-close"></i>
              </a>
              <div className="navbar-brand">
                <b className="logo-icon text-center">
                  <img src="/images/logo-icon.png" alt="homepage" className="dark-logo" />
                </b>
                <b className="text-center text-white" style={{paddingTop:'3px',paddingRight:'50px'}}>IPstress</b>
              </div>
            </div>
            <div className="navbar-collapse collapse" id="navbarSupportedContent">
              <ul className="navbar-nav float-left mr-auto ml-3 pl-1"></ul>
              <ul className="navbar-nav float-right">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="javascript:void(0)" data-toggle="dropdown">
                    <img src="/images/logo-icon.png" alt="homepage" className="dark-logo" width="29" />
                    <span className="ml-2 d-none d-lg-inline-block">
                      <span className="text-dark">Hello, Admin!</span>
                    </span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right user-dd animated flipInY">
                    <a className="dropdown-item" href="/web/admin/tickets">Inbox</a>
                    <a className="dropdown-item" href="/web/profile">Profile</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="/web/api/auth/logout">Logout</a>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        {/* Sidebar */}
        {/* Admin Panel | Rewritten June 2026 */}
        <aside className="left-sidebar" data-sidebarbg="skin6">
          <div className="scroll-sidebar">
            <nav className="sidebar-nav">
              <ul id="sidebarnav">
                <li className="nav-small-cap"><span className="hide-menu">Admin Panel</span></li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home feather-icon"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    <span className="hide-menu">Dashboard</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/users">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users feather-icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <span className="hide-menu">Users</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/plans">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock feather-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span className="hide-menu">Plans</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/tickets">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail feather-icon"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <span className="hide-menu">Tickets</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/attacklogs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-wifi-off feather-icon"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12" y2="20"></line></svg>
                    <span className="hide-menu">Attack Logs</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/loginlogs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user feather-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    <span className="hide-menu">Login Logs</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/news">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus feather-icon"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span className="hide-menu">News</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/giftcards">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus feather-icon"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span className="hide-menu">Gift Cards</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-up-circle feather-icon"><path d="M22 12 A10 10 0 0 1 12 22 A10 10 0 0 1 2 12 A10 10 0 0 1 22 12 z"/><path d="M16 12 L12 8 L8 12"/><path d="M12 16 L12 8"/></svg>
                    <span className="hide-menu">Settings</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/servers">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shield feather-icon"><path d="M12 22s8-4 8-10V4l-8-2-8 2v8c0 6 8 10 8 10z"></path></svg>
                    <span className="hide-menu">API Servers</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/methods">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus feather-icon"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span className="hide-menu">Methods</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/admin/hub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-power feather-icon"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                    <span className="hide-menu">Hub</span>
                  </Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/dashboard">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-power feather-icon"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                    <span className="hide-menu">Back to Home</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <div className="page-wrapper">
          {children}
          <footer className="footer">© 2023 IPstress</footer>
        </div>
      </div>
    </>
  );
}