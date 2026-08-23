/**
 * WEB ADMIN VIEWS PART 4 (FINAL) - tickets, attack/login logs, hub, settings.
 */
import { markup, unsafe, type Html } from '../core/04-html';
import { dashShell } from './web-admin';

const EMPTY: Html = unsafe('');

function emptyRow(cols: number, msg: string): Html {
    return markup`<tr><td colSpan="${cols}" class="text-center text-muted">${msg}</td></tr>`;
}

export function ticketsAdminView(tickets: unknown[]): string {
    const count = tickets.length;
    const rows =
        count > 0
            ? (
                  tickets as Array<{
                      id: number;
                      subject: string;
                      username: string;
                      status: string;
                      date: number;
                  }>
              ).map(
                  (tk) =>
                      markup`<tr><td>${tk.id}</td><td>${tk.subject}</td><td>${tk.username}</td><td>${tk.status}</td><td>${new Date(
                          tk.date * 1000
                      ).toLocaleDateString(
                          'en-US'
                      )}</td><td class="text-center"><a href="/web/admin/tickets/${
                          tk.id
                      }" class="btn btn-sm btn-primary">View</a></td></tr>`
              )
            : [emptyRow(6, 'No tickets found.')];
    return dashShell(
        'Tickets',
        markup`Tickets`,
        markup`<div class="container-fluid"><div class="row"><div class="col-12"><div class="card"><div class="card-body"><div class="d-flex align-items-center mb-3"><h4 class="card-title mb-0">All Tickets (${count})</h4><div class="ml-auto"><a href="/web/admin/tickets" class="btn btn-sm btn-primary mr-1">All</a><a href="/web/admin/tickets?status=open" class="btn btn-sm btn-secondary mr-1">Open</a><a href="/web/admin/tickets?status=user" class="btn btn-sm btn-secondary mr-1">User Reply</a><a href="/web/admin/tickets?status=closed" class="btn btn-sm btn-secondary">Closed</a></div></div><div class="table-responsive mt-4"><table class="table"><thead><tr><th>ID</th><th>Subject</th><th>User</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div></div></div>`
    );
}

export function attackLogsView(logs: unknown[]): string {
    const rows =
        logs.length > 0
            ? (
                  logs as Array<{
                      id: number;
                      user: string;
                      ip: string;
                      postdata: string;
                      method: string;
                      time: number;
                      chart: string;
                      stopped: number;
                  }>
              ).map(
                  (l) =>
                      markup`<tr><td>${l.id}</td><td>${l.user}</td><td>${l.ip}</td><td>${l.postdata}</td><td>${l.method}</td><td>${l.time}s</td><td>${l.chart}</td><td>${
                          l.stopped ? 'Stopped' : 'Running'
                      }</td></tr>`
              )
            : [emptyRow(9, 'No logs found.')];
    return dashShell(
        'Attack Logs',
        markup`Attack Logs`,
        markup`<div class="container-fluid"><div class="row"><div class="col-12"><div class="card"><div class="card-body"><h4 class="card-title">Attack Logs (${logs.length})</h4><div class="table-responsive mt-4"><table class="table"><thead><tr><th>ID</th><th>User</th><th>Target</th><th>Port</th><th>Method</th><th>Time</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div></div></div>`
    );
}

export function loginLogsView(logs: unknown[]): string {
    const rows =
        logs.length > 0
            ? (
                  logs as Array<{
                      id: number;
                      username: string;
                      ip: string;
                      country: string;
                      date: number;
                  }>
              ).map(
                  (l) =>
                      markup`<tr><td>${l.id}</td><td>${l.username}</td><td>${l.ip}</td><td>${l.country}</td><td>${new Date(
                          l.date * 1000
                      ).toLocaleString('en-US')}</td></tr>`
              )
            : [emptyRow(5, 'No login logs found.')];
    return dashShell(
        'Login Logs',
        markup`Login Logs`,
        markup`<div class="container-fluid"><div class="row"><div class="col-12"><div class="card"><div class="card-body"><h4 class="card-title">Login History (${logs.length})</h4><div class="table-responsive mt-4"><table class="table"><thead><tr><th>ID</th><th>Username</th><th>IP Address</th><th>Country</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div></div></div>`
    );
}

export function hubAdminView(
    layer4: Array<{ name: string; fullname: string }>,
    layer7: Array<{ name: string; fullname: string }>,
    servers: Array<{ name: string; slots: number }>
): string {
    const opt = (m: { name: string; fullname: string }) =>
        markup`<option value="${m.name}">${m.fullname || m.name}</option>`;
    const serverOpts = servers.map(
        (s) => markup`<option value="${s.name}">${s.name} (${s.slots} slots)</option>`
    );
    return dashShell(
        'Admin Hub',
        markup`Admin Hub`,
        markup`<div class="container-fluid"><div class="row"><div class="col-md-8 col-lg-6 mx-auto"><div class="card"><div class="card-body"><h4 class="card-title">Admin Attack Launcher</h4><p class="text-muted">No cooldown. No limits. Admin-only.</p><form class="mt-4" action="/web/api/admin/hub" method="POST"><div class="form-group"><label class="text-white" for="host">Host</label><input class="form-control" id="host" type="text" placeholder="1.1.1.1 or http://link.com" required name="host"/></div><div class="form-group"><label class="text-white" for="port">Port</label><input class="form-control" id="port" type="text" placeholder="80" name="port" value="80"/></div><div class="form-group"><label class="text-white" for="time">Time (Seconds)</label><input class="form-control" id="time" type="number" placeholder="30" required name="time" value="30"/></div><div class="form-group"><label class="text-white" for="method">Method</label><select class="form-control" id="method" name="method" required><optgroup label="Layer 4 Methods">${layer4.map(
            opt
        )}</optgroup><optgroup label="Layer 7 Methods">${layer7.map(opt)}</optgroup></select></div><div class="form-group"><label class="text-white" for="server">Server</label><select class="form-control" id="server" name="server"><option value="">Any available</option>${serverOpts}</select></div><button type="submit" class="btn btn-danger btn-block btn-lg">Launch</button></form></div></div></div></div></div>`
    );
}

interface SettingsData {
    sitename: string;
    url: string;
    description: string;
    cooldown: number;
    cooldownTime: number;
    maxattacks: number;
    testboots: number;
}

export function settingsView(s: SettingsData): string {
    const fg = (label: string, input: Html): Html =>
        markup`<div class="form-group"><label class="text-white">${label}</label>${input}</div>`;
    const num = (name: string, val: number | string): Html =>
        markup`<input class="form-control" type="number" name="${name}" value="${val}"/>`;
    const txt = (name: string, val: string): Html =>
        markup`<input class="form-control" name="${name}" value="${val}"/>`;
    const general = markup`<div class="col-md-6"><div class="card"><div class="card-body"><h4 class="card-title">General Settings</h4><form class="mt-4" action="/web/api/admin/settings" method="POST"><input type="hidden" name="action" value="update"/>${fg(
        'Site Name',
        txt('sitename', s.sitename)
    )}${fg('URL', txt('url', s.url))}<div class="form-group"><label class="text-white">Description</label><textarea class="form-control" name="description" rows="3">${
        s.description
    }</textarea></div>${fg('Cooldown', num('cooldown', s.cooldown))}${fg(
        'Cooldown Time (seconds)',
        num('cooldownTime', s.cooldownTime)
    )}${fg('Max Attacks Per User', num('maxattacks', s.maxattacks))}${fg(
        'Test Boots',
        num('testboots', s.testboots)
    )}<button type="submit" class="btn btn-primary">Save General Settings</button></form></div></div></div>`;

    const payments = markup`<div class="col-md-6"><div class="card"><div class="card-body"><h4 class="card-title">Payment Settings</h4><form class="mt-4" action="/web/api/admin/settings" method="POST"><input type="hidden" name="action" value="update"/><div class="form-group"><label class="text-white">PayPal Email</label><input class="form-control" name="paypal" value=""/></div><div class="form-group"><label class="text-white">Bitcoin Address</label><input class="form-control" name="bitcoin" value=""/></div><div class="form-group"><label class="text-white">Stripe Public Key</label><input class="form-control" name="stripePubKey" value=""/></div><div class="form-group"><label class="text-white">Stripe Secret Key</label><input class="form-control" type="password" name="stripeSecretKey" value=""/></div><button type="submit" class="btn btn-primary">Save Payment Settings</button></form></div></div></div>`;

    return dashShell(
        'Settings',
        markup`Settings`,
        markup`<div class="container-fluid"><div class="row">${general}${payments}</div></div>`
    );
}
