// Dumps every GET page of the RUNNING legacy Next.js server into tests/baseline/.
// Usage: BASE=http://localhost:3000 node scripts/dump-baseline.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.env.BASE ?? 'http://localhost:3000';
mkdirSync('tests/baseline', { recursive: true });

async function jar(loginPath, body) {
    const res = await fetch(BASE + loginPath, {
        method: 'POST',
        redirect: 'manual',
        headers: { Origin: BASE, 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });
    return (res.headers.getSetCookie?.() ?? []).map((c) => c.split(';')[0]).join('; ');
}

const anonRoutes = [
    ['index.html', '/'],
    ['tl1.html', '/tl1'],
    ['tl2.html', '/tl2'],
    ['tl3.html', '/tl3'],
    ['tl4.html', '/tl4'],
    ['search.html', '/search'],
    ['login.html', '/login'],
    ['submission.html', '/submission'],
    ['web-home.html', '/web'],
    ['web-login.html', '/web/login'],
    ['web-register.html', '/web/register'],
    ['web-plan.html', '/web/plan'],
    ['web-maintenance.html', '/web/maintenance'],
    ['web-giftcards-anon.html', '/web/giftcards'],
    ['web-affiliate-anon.html', '/web/affiliate'],
    ['web-tickets-anon.html', '/web/tickets'],
    ['web-tickets-new.html', '/web/tickets/new'],
    ['web-wheel.html', '/web/wheel'],
];

let ok = 0,
    fail = [];
for (const [name, route] of anonRoutes) {
    try {
        const res = await fetch(BASE + route);
        const text = await res.text();
        writeFileSync(`tests/baseline/${name}`, text);
        res.status === 200 ? ok++ : fail.push(`${route} -> ${res.status}`);
    } catch (e) {
        fail.push(`${route} -> ${e.message}`);
    }
}

const mainCookie = await jar('/api/auth/login', 'username=admin&password=admin123');
for (const [name, route] of [
    ['admin.html', '/admin'],
    ['admin-edit-1.html', '/admin/edit/1'],
]) {
    try {
        const res = await fetch(BASE + route, { headers: { Cookie: mainCookie } });
        const text = await res.text();
        writeFileSync(`tests/baseline/${name}`, text);
        res.status === 200 ? ok++ : fail.push(`${route} -> ${res.status}`);
    } catch (e) {
        fail.push(`${route} -> ${e.message}`);
    }
}

const webCookie = await jar('/web/api/auth/login', 'username=admin&password=admin123');
const webRoutes = [
    ['web-dashboard.html', '/web/dashboard'],
    ['web-hub.html', '/web/hub'],
    ['web-profile.html', '/web/profile'],
    ['web-tickets-authed.html', '/web/tickets'],
    ['web-admin-dashboard.html', '/web/admin/dashboard'],
    ['web-admin-users.html', '/web/admin/users'],
    ['web-admin-users-1.html', '/web/admin/users/1'],
    ['web-admin-plans.html', '/web/admin/plans'],
    ['web-admin-methods.html', '/web/admin/methods'],
    ['web-admin-news.html', '/web/admin/news'],
    ['web-admin-servers.html', '/web/admin/servers'],
    ['web-admin-settings.html', '/web/admin/settings'],
    ['web-admin-giftcards.html', '/web/admin/giftcards'],
    ['web-admin-tickets.html', '/web/admin/tickets'],
    ['web-admin-hub.html', '/web/admin/hub'],
    ['web-admin-attacklogs.html', '/web/admin/attacklogs'],
    ['web-admin-loginlogs.html', '/web/admin/loginlogs'],
];
for (const [name, route] of webRoutes) {
    try {
        const res = await fetch(BASE + route, { headers: { Cookie: webCookie } });
        const text = await res.text();
        writeFileSync(`tests/baseline/${name}`, text);
        res.status === 200 ? ok++ : fail.push(`${route} -> ${res.status} (cookie:${!!webCookie})`);
    } catch (e) {
        fail.push(`${route} -> ${e.message}`);
    }
}
console.log(`dumped OK=${ok} FAIL=${fail.length}`);
if (fail.length) console.log(fail.join('\n'));
process.exit(fail.length ? 1 : 0);
