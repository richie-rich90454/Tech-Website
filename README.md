# Tech-Website

_**Please read this stuff, it's quite important**_

> **Updated by richie-rich90454 in 2026/8 — v3 rewrite: no more Next.js/React. Just Node + a tiny custom core u can actually read.**

**How the backend works now:**

There's no framework anymore — the server is plain `node:http` plus a small OOP core in `src/core/` that we wrote ourselves. It's like ~1000 lines total and does routing, sessions, security headers, rate limiting, static files and caching. If u wanna understand how the site works, read `server.ts` first (it's just wiring), then `src/core/01-application.ts`.

Pages are EJS templates in `src/views/` — that's basically HTML with `<%= variable %>` holes. The server compiles them once at boot so they're super fast, and everything u interpolate gets auto-escaped so u can't accidentally make an XSS bug by forgetting to escape stuff.

**The database:**

Still SQLite (two files: `prisma/main.db` for tech tools, `prisma/web.db` for the SaaS panel) but Prisma got swapped for Drizzle ORM cuz it has zero CVEs and way less magic. The query style is almost identical so it's an easy swap. Schemas live in `src/lib/db/schema-main.ts` and `schema-web.ts`. The full dependency tree audits **0 vulnerabilities** (plain `npm audit`, dev deps included) — that's a release gate, not a hope.

If u wanna reset the database, just run `npm run db:reset` and it'll wipe everything and re-seed it with test data.

**Frontend / client scripts:**

There's no React. Pages come straight from the server as HTML (works without JS!), and the little bits of client-side behavior (menu, tabs, wheel spinning, dark mode toggle) are modern TypeScript files in `src/client/`. The build compiles them with `tsc` down to plain ES5 JavaScript into `dist/public/js/`, so even Chrome 49 and IE11 can run them. Same idea for CSS: u write clean modern CSS in `src/styles/` and PostCSS + Autoprefixer transpile it into `dist/public/css/`.

**The public/dist split (important):**

- `public/` is passthrough assets ONLY — images, fonts, screenshots. Nothing in there gets compiled, and nothing compiled ever lives there.
- `dist/` is everything the server actually serves: the compiled server, the EJS copies, the ES5 JS, the prefixed CSS, and the `.gz`/`.br` compressed siblings.

The static file server serves from `dist/public` exclusively. If that folder is missing it refuses to boot with a "run npm run build" message — no silent fallbacks, cuz those caused real stale-content bugs during development.

Dark/light mode is **server-rendered**: when u toggle it, a tiny `theme` cookie gets set, and on every later request the server stamps `data-theme="dark"` straight onto `<html>` before sending the page — so there's no flash of wrong theme, no inline script (keeps our CSP happy), and it even works with JavaScript disabled. The styling itself swaps CSS variables only — look at `[data-theme='dark']` in globals.css.

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
npm run dev starts everything u need with hot reloading — three watchers (server, client TS, CSS) plus an asset sync, all writing into `dist/public`. Save a .ts, .css or .ejs file and refresh: it's there. No restart needed for templates or styles.

**Other useful commands:**

```
npm run build        # builds everything into dist/ (server + ES5 js + prefixed css + gz/br)
npm run start        # starts the production server from dist/
npm run check        # typecheck + lint + dependency audit
npm test             # unit tests
npm run check:views  # renders every .ejs template with sample data
npm run check:hot    # proves dev renders template edits without a restart
npm run check:full   # everything above in one shot
npm run parity       # diffs rendered pages vs frozen legacy baselines
npm run db:migrate   # generates SQL migrations after schema changes
npm run db:reset     # wipes and re-seeds both databases
```

**Deploying (VPS):**

`deploy.sh` copies the repo, runs `npm ci && npm run build`, then restarts the systemd service (`deploy/tech-website.service`). Nginx sits in front for TLS — see `deploy/nginx.conf.example`. Set ur secrets in `.env` on the server (copy `.env.example`), the app refuses to boot without them which is intentional.

**Using Github:**

Make pull requests to propose changes, cuz that's how github works. If u don't know how to use github, then look up a tutorial or learn from other members.
