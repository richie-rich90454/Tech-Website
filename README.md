# Tech-Website

_**Please read this stuff, it's quite important**_

> **Updated by richie-rich90454 in 2026/8 — v3 rewrite: no more Next.js/React. Just Node + a tiny custom core u can actually read.**

**How the backend works now:**

There's no framework anymore — the server is plain `node:http` plus a small OOP core in `src/core/` that we wrote ourselves. It's like ~1000 lines total and does routing, sessions, security headers, rate limiting, static files and caching. If u wanna understand how the site works, read `server.ts` first (it's just wiring), then `src/core/01-application.ts`.

Pages are EJS templates in `src/views/` — that's basically HTML with `<%= variable %>` holes. The server compiles them once at boot so they're super fast, and everything u interpolate gets auto-escaped so u can't accidentally make an XSS bug by forgetting to escape stuff.

**The database:**

Still SQLite (two files: `prisma/main.db` for tech tools, `prisma/web.db` for the SaaS panel) but Prisma got swapped for Drizzle ORM cuz it has zero CVEs and way less magic. The query style is almost identical so it's an easy swap. Schemas live in `src/lib/db/schema-main.ts` and `schema-web.ts`.

If u wanna reset the database, just run `npm run db:reset` and it'll wipe everything and re-seed it with test data.

**Frontend / client scripts:**

There's no React. Pages come straight from the server as HTML (works without JS!), and the little bits of client-side behavior (menu, tabs, wheel spinning, dark mode toggle) are TypeScript files in `public/ts/` that get compiled to plain ES5 JavaScript so even Chrome 49 and IE11 can run them. Dark/light mode swaps CSS variables only — look at `[data-theme='dark']` in globals.css, that's the whole feature.

**Install node.js & run the project:**

Everyone should install node js (v22+) and npm on their own machines so they can test run the server themselves to see if stuff works. Since github doesn't allow me to upload node_modules, u'll have to run `npm install` urself after cloning the repo.

Running the project:

```
npm install
```

then

```
npm run dev
```

npm install downloads all the dependencies listed in package.json.
npm run dev starts a local dev server on localhost:3000 with watchers — change a .ts or .ejs file and it reloads/rebuilds automatically.

**Other useful commands:**

```
npm run build        # builds everything into dist/ (server + views + assets)
npm run start        # starts the production server from dist/
npm run check        # typecheck + lint + dependency audit
npm test             # unit tests
npm run check:views  # renders every .ejs template with sample data
npm run parity       # diffs rendered pages vs frozen legacy baselines
npm run db:migrate   # generates SQL migrations after schema changes
npm run db:reset     # wipes and re-seeds both databases
```

**Deploying (VPS):**

`deploy.sh` copies the repo, runs `npm ci && npm run build`, then restarts the systemd service (`deploy/tech-website.service`). Nginx sits in front for TLS — see `deploy/nginx.conf.example`. Set ur secrets in `.env` on the server (copy `.env.example`), the app refuses to boot without them which is intentional.

**Using Github:**

Make pull requests to propose changes, cuz that's how github works. If u don't know how to use github, then look up a tutorial or learn from other members.
