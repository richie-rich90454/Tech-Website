'use client';
import Link from 'next/link';
import Script from 'next/script';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* richie-rich90454 · dashboard rewrite · 2026/06 · stay curious */}
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
                  <img src="/web/dash/assets/images/logo-icon.png" alt="homepage" className="dark-logo" />
                </b>
                <b className="text-center text-white" style={{paddingTop:'3px',paddingRight:'50px'}}>IPstress</b>
              </div>
            </div>
            <div className="navbar-collapse collapse" id="navbarSupportedContent">
              <ul className="navbar-nav float-left mr-auto ml-3 pl-1"></ul>
              <ul className="navbar-nav float-right">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="javascript:void(0)" data-toggle="dropdown">
                    <img src="/web/dash/assets/images/logo-icon.png" alt="homepage" className="dark-logo" width="29" />
                    <span className="ml-2 d-none d-lg-inline-block">
                      <span className="text-dark">Hello, User!</span>
                    </span>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right user-dd animated flipInY">
                    <a className="dropdown-item" href="/web/tickets">Inbox</a>
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
        <aside className="left-sidebar" data-sidebarbg="skin5">
          <div className="scroll-sidebar">
            <nav className="sidebar-nav">
              <ul id="sidebarnav">
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/dashboard">Dashboard</Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/hub">Hub</Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/plan">Plans</Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/tickets">Tickets</Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/giftcards">Gift Cards</Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/affiliate">Affiliate</Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/profile">Profile</Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/wheel">Wheel</Link>
                </li>
                <li className="sidebar-item">
                  <Link className="sidebar-link" href="/web/logout">Logout</Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <div className="page-wrapper">
          {children}
          {/* Footer */}
          {/* IPstress Dashboard | Rewritten June 2026 | Next.js 15 + Prisma */}
          <footer className="footer">© 2023 IPstress</footer>
        </div>
      </div>
      {/* Scripts */}
      <Script src="/web/dash/js/jquery.min.js" strategy="beforeInteractive" />
      <Script src="/web/dash/js/popper.min.js" strategy="beforeInteractive" />
      <Script src="/web/dash/js/bootstrap.min.js" strategy="beforeInteractive" />
      <Script src="/web/dash/js/sidebarmenu.js" strategy="afterInteractive" />
      <Script src="/web/dash/js/perfect-scrollbar.jquery.min.js" strategy="afterInteractive" />
      <Script src="/web/dash/js/feather.min.js" strategy="afterInteractive" />
      <Script src="/web/dash/js/custom.min.js" strategy="afterInteractive" />
    </>
  );
}