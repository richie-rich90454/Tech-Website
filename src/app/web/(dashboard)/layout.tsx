'use client';
import { useEffect } from 'react';
import DashHeader from '@/components/web/DashHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }): React.ReactElement {
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
    // Close sidebar on nav link click (mobile)
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 880) {
          sidebar?.classList.remove('open');
        }
      });
    });
  }, []);
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
      <div
        id="main-wrapper"
        data-theme="dark"
        data-layout="vertical"
        data-navbarbg="skin6"
        data-sidebartype="full"
        data-sidebar-position="fixed"
        data-header-position="fixed"
        data-boxed-layout="full"
      >
        <DashHeader userName="User" />
        {/* Sidebar */}
        <aside className="left-sidebar" data-sidebarbg="skin5">
          <div className="scroll-sidebar">
            <nav className="sidebar-nav">
              <ul id="sidebarnav">
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/web/dashboard">Dashboard</a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/web/hub">Hub</a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/web/plan">Plans</a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/web/tickets">Tickets</a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/web/giftcards">Gift Cards</a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/web/affiliate">Affiliate</a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/web/profile">Profile</a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/web/wheel">Wheel</a>
                </li>
                <li className="sidebar-item">
                  <a className="sidebar-link" href="/web/logout">Logout</a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <div className="page-wrapper">
          {children}
          {/* Footer */}
          {/* IPstress Dashboard | Rewritten June 2026 | Next.js 15 + Prisma */}
          <footer className="footer">© 2026 IPstress</footer>
        </div>
      </div>
    </>
  );
}
