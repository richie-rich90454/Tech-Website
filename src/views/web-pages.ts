/**
 * WEB USER PAGE VIEWS - hub, profile (parity-transcribed) and functional
 * ports of tickets/giftcards/affiliate/wheel/maintenance/plan.
 */

import { markup, unsafe, type Html } from '../core/04-html';
import { shell } from './shell';
import { webHeader } from './web-public';
import type { UserRow, PlanRow } from '../types/db';

function webShell(title: string, body: Html): string {
    return shell({ title, body, css: ['webtheme.css'] });
}

function breadcrumb(page: string, crumb = page, firstActive = false): Html {
    const activeCls = firstActive ? markup` active` : '';
    return markup`<div class="page-breadcrumb"><div class="d-flex align-items-center"><h4 class="page-title text-truncate text-white font-weight-medium mb-0">${page}</h4><div class="ml-auto"><nav aria-label="breadcrumb"><ol class="breadcrumb m-0 p-0"><li class="breadcrumb-item text-sql${activeCls}" aria-current="page">IPstress</li><li class="breadcrumb-item text-muted" aria-current="page">${crumb}</li></ol></nav></div></div></div>`;
}

export function hubView(
    methods: Array<{ name: string; fullname?: string }>,
    servers: Array<{ name: string; slots: number }>
): string {
    const methodOptions =
        methods.length === 0
            ? markup`<option value="">No methods available</option>`
            : markup`${methods.map(
                  (m) => markup`<option value="${m.name}">${m.fullname || m.name}</option>`
              )}`;
    const serverOptions =
        servers.length === 0
            ? markup`<option value="">No servers available</option>`
            : markup`${servers.map((s) => markup`<option value="${s.name}">${s.name} (${s.slots} slots)</option>`)}`;
    return webShell(
        'Hub · IPstress',
        markup`${webHeader()}${breadcrumb('Attack Hub', 'Hub')}<div class="container-fluid"><div class="row"><div class="col-md-8 col-lg-6 mx-auto"><div class="card"><div class="card-body"><h4 class="card-title">Launch Attack</h4><div class="mt-4 activity"><form action="/web/api/hub" method="POST"><div class="form-group"><label class="text-white" for="host">Host</label><input class="form-control" id="host" type="text" placeholder="Enter target IP or hostname" required name="host"/></div><div class="form-group"><label class="text-white" for="port">Port</label><input class="form-control" id="port" type="text" placeholder="80" name="port" value="80"/></div><div class="form-group"><label class="text-white" for="time">Time (seconds)</label><select class="form-control" id="time" name="time"><option value="30">30 seconds</option><option value="60">60 seconds</option><option value="120">120 seconds</option><option value="180">180 seconds</option><option value="300">300 seconds</option><option value="600">600 seconds</option></select></div><div class="form-group"><label class="text-white" for="method">Method</label><select class="form-control" id="method" name="method">${methodOptions}</select></div><div class="form-group"><label class="text-white" for="server">Server</label><select class="form-control" id="server" name="server">${serverOptions}</select></div><button type="submit" class="btn btn-danger btn-block btn-lg">Start Attack</button></form></div></div></div></div></div></div>`
    );
}

export function profileView(user: UserRow, plan: PlanRow | null): string {
    const money = '\u00a5';
    const membership = plan ? plan.name : 'No membership';
    const maxTime = plan ? `${plan.mbt}s` : 'No membership';
    const maxCon = plan ? String(plan.concurrents) : 'No membership';
    const expiry = new Date(user.expire * 1000).toLocaleDateString('en-US');
    const refLink = user.referral
        ? `https://ipstress.com/web/register?ref=${user.referral}`
        : 'N/A';
    return webShell(
        'Profile · IPstress',
        markup`${webHeader()}${breadcrumb('Profile', 'Profile', true)}<div class="container-fluid"><div class="row"><div class="col-md-6 col-lg-6"><div class="card"><div class="card-body"><h4 class="card-title">Account Info</h4><div class="mt-4 activity"><div class="table-responsive"><table class="table"><tbody><tr><td>ID</td><td>${user.ID}</td></tr><tr><td>Username</td><td>${user.username}</td></tr><tr><td>Membership</td><td>${membership}</td></tr><tr><td>Max Attack Time</td><td>${maxTime}</td></tr><tr><td>Max Concurrents</td><td>${maxCon}</td></tr><tr><td>Expiry</td><td>${expiry}</td></tr></tbody></table></div></div></div></div></div><div class="col-md-6 col-lg-6"><div class="card"><div class="card-body"><h4 class="card-title">Referral</h4><div class="mt-4 activity"><div class="form-group"><label class="text-white">Referral Link</label><input class="form-control" type="text" readonly value="${refLink}"/></div><div class="form-group"><label class="text-white">Referral Balance</label><p class="text-white font-weight-medium">${user.referralbalance}${money}</p></div></div></div></div></div><div class="col-md-6 col-lg-12"><div class="card"><div class="card-body"><h4 class="card-title">Change Password</h4><div class="mt-2 activity"><div class="row"><div class="col-lg-12"><form action="/web/api/profile/password" method="post"><div class="form-group"><label class="text-white" for="old">Current Password</label><input class="form-control" id="old" type="password" required name="old"/></div><div class="form-group"><label class="text-white" for="new">New Password</label><input class="form-control" id="new" type="password" required name="new"/></div><div class="form-group"><label class="text-white" for="rnew">Repeat New Password</label><input class="form-control" id="rnew" type="password" required name="rnew"/></div><div class="form-group"><button value="change" type="submit" class="btn btn-primary" name="update">Change Password</button></div></form></div></div></div></div></div></div></div></div>`
    );
}

export function maintenanceView(description: string): string {
    return shell({
        title: 'Maintenance · IPstress',
        css: ['webtheme.css'],
        body: markup`${webHeader()}<div style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0a0e27;color:#fff;text-align:center"><div><h1 style="font-size:3rem;margin-bottom:1rem">&#128736; Maintenance Mode</h1><p style="font-size:1.2rem;max-width:600px">${description}</p><a style="color:#0cf293;margin-top:2rem;display:inline-block" href="/web">Return Home</a></div></div>`,
    });
}
