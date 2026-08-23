/**
 * ============================================================================
 * WEB ADMIN VIEWS - IPstress back office (all pages).
 * ============================================================================
 * dashShell() reproduces the legacy admin chrome: preloader, #main-wrapper
 * data attributes, topbar with account dropdown, feather-icon sidebar.
 * All icon paths frozen from the baseline dump. Bootstrap-style class names
 * are global (webtheme.css) - no CSS-module hashing on these pages.
 */

import { markup, unsafe, type Html } from '../core/04-html';
import { shell } from './shell';
import type { UserRow, PlanRow } from '../types/db';

const EMPTY: Html = unsafe('');

const ICONS: Record<string, string> = {
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
    mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
    wifioff:
        '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12" y2="20"></line>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
    settings:
        '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
    shield: '<path d="M12 22s8-4 8-10V4l-8-2-8 2v8c0 6 8 10 8 10z"></path>',
    power: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line>',
};

function feather(name: string): Html {
    const inner = ICONS[name] ?? '';
    return markup`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-${unsafe(
        name
    )} feather-icon">${unsafe(inner)}</svg>`;
}

interface SideItem {
    href: string;
    icon: string;
    label: string;
}

const SIDEBAR: SideItem[] = [
    { href: '/web/admin/dashboard', icon: 'home', label: 'Dashboard' },
    { href: '/web/admin/users', icon: 'users', label: 'Users' },
    { href: '/web/admin/plans', icon: 'lock', label: 'Plans' },
    { href: '/web/admin/tickets', icon: 'mail', label: 'Tickets' },
    { href: '/web/admin/attacklogs', icon: 'wifioff', label: 'Attack Logs' },
    { href: '/web/admin/loginlogs', icon: 'user', label: 'Login Logs' },
    { href: '/web/admin/news', icon: 'plus', label: 'News' },
    { href: '/web/admin/giftcards', icon: 'plus', label: 'Gift Cards' },
    { href: '/web/admin/settings', icon: 'settings', label: 'Settings' },
    { href: '/web/admin/servers', icon: 'shield', label: 'API Servers' },
    { href: '/web/admin/methods', icon: 'plus', label: 'Methods' },
    { href: '/web/admin/hub', icon: 'power', label: 'Hub' },
];

export function dashShell(title: string, crumb: Html, content: Html): string {
    const items = SIDEBAR.map(
        (it) =>
            markup`<li class="sidebar-item"><a class="sidebar-link" href="${it.href}">${feather(
                it.icon
            )}<span class="hide-menu">${it.label}</span></a></li>`
    );
    return shell({
        title: `${title} · IPstress`,
        css: ['webtheme.css'],
        scripts: ['menu.js'],
        body: markup`<div class="preloader"><div class="lds-ripple"><div class="spinner-grow" role="status"><span class="sr-only">Loading...</span></div></div></div><div id="main-wrapper" data-theme="dark" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed" data-boxed-layout="full"><header class="topbar" data-navbarbg="skin6"><nav class="navbar top-navbar navbar-dark"><div class="navbar-header" data-logobg="skin6"><a class="nav-toggler waves-effect waves-dark d-block d-md-none" href="javascript:void(0)"><i class="ti-menu ti-close"></i></a><div class="navbar-brand"><b class="logo-icon text-center"><img src="/images/logo-icon.png" alt="homepage" class="dark-logo"/></b><b class="text-center text-white" style="padding-top:3px;padding-right:50px">IPstress</b></div></div><div class="navbar-collapse collapse" id="navbarSupportedContent"><ul class="navbar-nav float-left mr-auto ml-3 pl-1"></ul><ul class="navbar-nav float-right"><li class="nav-item dropdown"><a class="nav-link dropdown-toggle" href="javascript:void(0)" data-toggle="dropdown"><img src="/images/logo-icon.png" alt="homepage" class="dark-logo" width="29"/><span class="ml-2 d-none d-lg-inline-block"><span class="text-dark">Hello, Admin!</span></span></a><div class="dropdown-menu dropdown-menu-right user-dd animated flipInY"><a class="dropdown-item" href="/web/admin/tickets">Inbox</a><a class="dropdown-item" href="/web/profile">Profile</a><div class="dropdown-divider"></div><a class="dropdown-item" href="/web/api/auth/logout">Logout</a></div></li></ul></div></nav></header><aside class="left-sidebar" data-sidebarbg="skin6"><div class="scroll-sidebar"><nav class="sidebar-nav"><ul id="sidebarnav"><li class="nav-small-cap"><span class="hide-menu">Admin Panel</span></li>${items}</ul></nav></div></aside><div class="page-wrapper"><div class="page-breadcrumb"><div class="d-flex align-items-center"><h4 class="page-title text-truncate text-white font-weight-medium mb-0">${title}</h4><div class="ml-auto"><nav aria-label="breadcrumb"><ol class="breadcrumb m-0 p-0"><li class="breadcrumb-item text-sql">IPstress</li><li class="breadcrumb-item text-muted">${crumb}</li></ol></nav></div></div></div>${content}<footer class="footer">\u00a9 2026 IPstress</footer></div></div>`,
    });
}

function emptyRow(cols: number, message: string): Html {
    return markup`<tr><td colSpan="${cols}" class="text-center text-muted">${message}</td></tr>`;
}

function statCard(value: string | number, label: string, icon: string): Html {
    return markup`<div class="card border-right"><div class="card-body"><div class="d-flex d-lg-flex d-md-block align-items-center"><div><div class="d-inline-flex align-items-center"><h2 class="text-white mb-1 font-weight-medium">${value}</h2></div><h6 class="text-muted font-weight-normal mb-0 w-100 text-truncate mb-2">${label}</h6></div><div class="ml-auto mt-md-3 mt-lg-0"><span class="opacity-7 text-muted">${feather(icon)}</span></div></div></div></div>`;
}

export interface DashStats {
    totalUsers: number;
    activeUsers: number;
    totalAttacks: number;
    runningAttacks: number;
    waitingTickets: number;
}

export function adminDashboardView(s: DashStats): string {
    return dashShell(
        'Admin Dashboard',
        markup`Admin Dashboard`,
        markup`<div class="container-fluid"><div class="card-group">${statCard(
            s.totalUsers,
            'Total Users',
            'users'
        )}${statCard(s.activeUsers, 'Active Users', 'users')}${statCard(
            s.totalAttacks,
            'Total Attacks',
            'plus'
        )}${statCard(s.runningAttacks, 'Running Attacks', 'power')}${statCard(
            s.waitingTickets,
            'Waiting Tickets',
            'mail'
        )}</div></div>`
    );
}

export function usersAdminView(users: UserRow[]): string {
    const rows =
        users.length > 0
            ? users.map(
                  (u) =>
                      markup`<tr><td class="text-center">${u.ID}</td><td>${u.username}</td><td>${
                          Number(u.rank) >= 1 ? 'Admin' : 'User'
                      }</td><td>${Number(u.membership) || 'None'}</td><td class="text-center"><a href="/web/admin/users/${
                          u.ID
                      }" class="btn btn-sm btn-primary">Edit</a></td></tr>`
              )
            : [emptyRow(5, 'No users found.')];
    return dashShell(
        'Users',
        markup`Users`,
        markup`<div class="container-fluid"><div class="row"><div class="col-12"><div class="card"><div class="card-body"><h4 class="card-title">All Users (${users.length})</h4><div class="table-responsive mt-4"><table class="table"><thead><tr><th>ID</th><th>Username</th><th>Rank</th><th>Membership</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div></div></div>`
    );
}

export function userEditView(user: UserRow, plans: PlanRow[]): string {
    const planOpts = plans.map(
        (pl) =>
            markup`<option value="${pl.ID}"${
                Number(user.membership) === pl.ID ? unsafe(' selected') : EMPTY
            }>${pl.name}</option>`
    );
    return dashShell(
        'Edit User',
        markup`<a href="/web/admin/users">Users</a> | ${user.username}`,
        markup`<div class="container-fluid"><div class="row"><div class="col-md-8 col-lg-6"><div class="card"><div class="card-body"><h4 class="card-title">Edit: ${user.username}</h4><form class="mt-4" action="/web/api/admin/users" method="POST"><input type="hidden" name="id" value="${user.ID}"/><input type="hidden" name="action" value="update"/><div class="form-group"><label class="text-white">Username</label><input class="form-control" required name="username" value="${user.username}"/></div><div class="form-group"><label class="text-white">New Password (leave blank to keep)</label><input class="form-control" type="password" placeholder="Leave blank to keep current" name="password"/></div><div class="form-group"><label class="text-white">Rank</label><select class="form-control" name="rank"><option value="0"${
            Number(user.rank) === 0 ? unsafe(' selected') : EMPTY
        }>User</option><option value="1"${
            Number(user.rank) === 1 ? unsafe(' selected') : EMPTY
        }>Admin</option><option value="2"${
            Number(user.rank) === 2 ? unsafe(' selected') : EMPTY
        }>Super Admin</option></select></div><div class="form-group"><label class="text-white">Membership</label><select class="form-control" name="membership"><option value="0"${
            !user.membership ? unsafe(' selected') : EMPTY
        }>None</option>${planOpts}</select></div><div class="form-group"><label class="text-white">Expire (Unix timestamp)</label><input class="form-control" type="number" name="expire" value="${
            user.expire
        }"/></div><button type="submit" class="btn btn-primary">Update User</button></form></div></div></div></div></div>`
    );
}
