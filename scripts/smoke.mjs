// Production smoke test. Run against a booted server:
//   BASE=http://localhost:3000 node scripts/smoke.mjs
// Exits non-zero if any check fails.
const BASE = process.env.BASE || "http://localhost:3000";

let failures = 0;
function check(name, pass, detail = "") {
    console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` (${detail})` : ""}`);
    if (!pass) failures += 1;
}

async function main() {
    // 1. Health
    const health = await fetch(`${BASE}/api/health`);
    check("health endpoint", health.status === 200);

    // 2. Home + TL page render
    const home = await fetch(`${BASE}/`);
    check("home renders", home.status === 200 && (await home.text()).includes("Tech Tools"));
    const tl = await fetch(`${BASE}/tl1`);
    check("tl1 renders", tl.status === 200);

    // 3. Unauthenticated admin APIs are closed
    const r1 = await fetch(`${BASE}/api/admin/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: 1 }),
    });
    check("main admin API blocked when unauth", r1.status === 401, String(r1.status));

    const r2 = await fetch(`${BASE}/web/api/admin/settings`);
    check("web admin API blocked when unauth", r2.status === 401, String(r2.status));

    const r3 = await fetch(`${BASE}/web/api/hub/stats`);
    check("hub stats requires auth", r3.status === 401, String(r3.status));

    // 4. CSRF: cross-origin mutation is blocked by middleware
    const csrf = await fetch(`${BASE}/api/submission`, {
        method: "POST",
        headers: { Origin: "http://evil.example" },
        body: new URLSearchParams({ techname: "x", link: "x", displaytext: "x" }),
    });
    check("cross-origin POST blocked (CSRF)", csrf.status === 403, String(csrf.status));

    // 5. Login sets the session cookie
    const login = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        redirect: "manual",
        headers: { Origin: BASE },
        body: new URLSearchParams({
            username: "admin",
            password: process.env.SMOKE_ADMIN_PASSWORD || "admin123",
        }),
    });
    const setCookie = login.headers.getSetCookie?.() ?? [];
    const cookie = setCookie.map((c) => c.split(";")[0]).join("; ");
    check("login redirects", [302, 303, 307, 308].includes(login.status), String(login.status));
    check("login issues session cookie", !!cookie);

    // 6. Authenticated admin call passes the guard
    if (cookie) {
        const ok = await fetch(`${BASE}/api/admin/reject`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Cookie: cookie, Origin: BASE },
            body: JSON.stringify({ id: 99999 }),
        });
        check("authed admin request allowed", ok.status === 200, String(ok.status));
    }

    // 7. Rate limiting kicks in on the login route
    let got429 = false;
    for (let i = 0; i < 12; i += 1) {
        const res = await fetch(`${BASE}/api/auth/login`, {
            method: "POST",
            headers: { Origin: BASE },
            body: new URLSearchParams({ username: "nobody", password: "wrong" }),
        });
        if (res.status === 429) {
            got429 = true;
            break;
        }
    }
    check("login rate limit returns 429", got429);

    // 8. SEO endpoints
    const robots = await fetch(`${BASE}/robots.txt`);
    check("robots.txt served", robots.status === 200 && (await robots.text()).includes("Disallow"));
    const sitemap = await fetch(`${BASE}/sitemap.xml`);
    const sitemapBody = await sitemap.text();
    check(
        "sitemap.xml valid",
        sitemap.status === 200 && /<urlset[\s>]/.test(sitemapBody),
        `${sitemap.status}, ${sitemapBody.length} bytes`
    );

    if (failures > 0) {
        console.error(`\n${failures} check(s) FAILED`);
        process.exit(1);
    }
    console.log("\nAll smoke checks passed.");
}

main().catch((e) => {
    console.error("Smoke test crashed:", e);
    process.exit(1);
});
