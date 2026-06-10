# Tasks

## Phase 1: Project Foundation (Commits 1–8)

- [ ] Task 1: Initialize Next.js 15 project with TypeScript and core tooling
  - [ ] 1.1: Run `npx create-next-app@latest .` with TypeScript, ESLint, Tailwind CSS, App Router, Turbopack, src/ directory, no pre-existing files overwritten — initial scaffold commit
  - [ ] 1.2: Install production dependencies: `prisma @prisma/client zod fuse.js exceljs iron-session bcryptjs` and commit package.json + package-lock.json
  - [ ] 1.3: Install dev dependencies: `@types/bcryptjs prettier` and commit
  - [ ] 1.4: Configure tsconfig.json — add `@/` path alias mapping to `src/`, enable strict mode, configure target/module to ESNext
  - [ ] 1.5: Create `.env` with all required variables (DB_MAIN_HOST, DB_MAIN_USER, DB_MAIN_PASSWORD, DB_MAIN_NAME, DB_WEB_HOST, DB_WEB_USER, DB_WEB_PASSWORD, DB_WEB_NAME, SESSION_SECRET, RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY) — use placeholder comments
  - [ ] 1.6: Create `.env.example` with descriptive comments for each variable (no real values)
  - [ ] 1.7: Configure `next.config.ts` — enable `basePath` or rewrites so `/web/*` routes map cleanly, configure `images` domains for external banner images
  - [ ] 1.8: Create `.prettierrc` with 2-space indent, single quotes, trailing commas, semi: true, printWidth 100
  - [ ] 1.9: Create `.eslintrc.json` extending next/core-web-vitals and next/typescript, add rule overrides for project conventions

- [ ] Task 2: Create Prisma schemas for both databases
  - [ ] 2.1: Write `prisma/schema-main.prisma` — map `submission` table (id, techname, tl1_desc, tl2_desc, tl3_desc, tl4_desc, link, displaytext, accepted, username, contact) with datasource pointing to DB_MAIN_* env vars
  - [ ] 2.2: Write `prisma/schema-main.prisma` — map `domains` table (id, R, TP, MT, AR, U, MDL, RA, RoTech, LS, RoThink, EoST, EF, RTE, DLoI, RaAoC) with same datasource
  - [ ] 2.3: Write `prisma/schema-main.prisma` — map `login` table (PW, User) for admin auth
  - [ ] 2.4: Write `prisma/schema-web.prisma` — map `users` table with all columns (ID, username, password, rank, membership, expire, status, referral, referralbalance, testattack, activity, 2auth, referedBy, login_ip, login_useragent, cark, ban_sbp)
  - [ ] 2.5: Write `prisma/schema-web.prisma` — map `logs` table (id, user, ip, time, method, postdata, mode, ratelimit, cookie, date, chart, stopped, handler, origin)
  - [ ] 2.6: Write `prisma/schema-web.prisma` — map `plans`, `payments`, `tickets`, `messages` tables
  - [ ] 2.7: Write `prisma/schema-web.prisma` — map `settings`, `api`, `servers`, `methods`, `news`, `giftcards`, `bans`, `blacklist`, `iplogs`, `loginlogs`, `affiliateWithdraws`, `cark`, `fe`, `faq`, `tos`, `reports`, `2authsettings`, `smtpsettings`, `ping_sessions`, `actions` tables
  - [ ] 2.8: Create `src/lib/db/main.ts` — Prisma client singleton for main database with proper hot-reload handling
  - [ ] 2.9: Create `src/lib/db/web.ts` — Prisma client singleton for web database with proper hot-reload handling
  - [ ] 2.10: Create `src/lib/db/queries/submissions.ts` — `getAllSubmissions`, `getAcceptedSubmissions`, `getSubmissionById`, `createSubmission`, `updateSubmission`, `deleteSubmission`
  - [ ] 2.11: Create `src/lib/db/queries/domains.ts` — `getDomainsById`, `getDomainsByTL`, `createDomain`, `updateDomain`, `deleteDomain`
  - [ ] 2.12: Create `src/lib/db/queries/web/users.ts` — `getUserById`, `getUserByUsername`, `createUser`, `updateUser`, `banUser`, `deleteUser`, `getAllUsers`, `getUserCount`
  - [ ] 2.13: Create `src/lib/db/queries/web/logs.ts` — `createLog`, `getLogsByUser`, `getAllLogs`, `getRunningLogs`, `stopLog`
  - [ ] 2.14: Create `src/lib/db/queries/web/plans.ts` — `getAllPlans`, `getPlanById`, `createPlan`, `updatePlan`, `deletePlan`
  - [ ] 2.15: Create `src/lib/db/queries/web/tickets.ts` — `getTicketsByUser`, `getAllTickets`, `getTicketById`, `createTicket`, `createMessage`, `updateTicketStatus`
  - [ ] 2.16: Create `src/lib/db/queries/web/misc.ts` — `getSettings`, `updateSettings`, `getNews`, `createNews`, `deleteNews`, `getGiftCards`, `createGiftCard`, `redeemGiftCard`, `getMethods`, `getServers`, `getPayments`

## Phase 2: Main App — BIBS-C Tech Tools (Commits 9–32)

- [ ] Task 3: Port CSS assets and layout shell
  - [ ] 3.1: Copy `public/main.css` verbatim into `src/app/globals.css` — preserve every selector and rule exactly
  - [ ] 3.2: Append `public/main2.css` rules into `src/app/globals.css` — no conflicts, just concatenate
  - [ ] 3.3: Copy `public/form.css` into `src/app/form.css`
  - [ ] 3.4: Copy `public/login.css` into `src/app/login.css`
  - [ ] 3.5: Create `src/app/layout.tsx` — import globals.css, set metadata (title: "BIBS·C Tech Tools", favicon link), wrap children in html/body with same class structure as original EJS
  - [ ] 3.6: Copy all images from `/images/` (1.png–27.png, favicon.png) into `/public/images/`

- [ ] Task 4: Build shared UI components (Navbar, Footer)
  - [ ] 4.1: Create `src/components/Navbar.tsx` — render the topbar with "BIBS·C Tech Tools" h1, nav links (Home, TL1, TL2, TL3, TL4) with underline divs, search form posting to /search
  - [ ] 4.2: Create `src/components/Footer.tsx` — render footer with TL links and copyright "© 2023 BIBS·C Tech Tips"
  - [ ] 4.3: Add hidden HTML comment easter egg in Footer: `<!-- Rewritten with ♥ in June 2026 | Stack: Next.js 15, React 19, TypeScript, Prisma -->`
  - [ ] 4.4: Create `src/components/Subhead.tsx` — reusable subhead banner component with title and optional children (for filter forms)

- [ ] Task 5: Build homepage (/) components and page
  - [ ] 5.1: Create `src/components/HeroSection.tsx` — cover div with banner image and welcome h1 text
  - [ ] 5.2: Create `src/components/TLCard.tsx` — individual TL domain card (colored header, strand list, link to /tlN)
  - [ ] 5.3: Create `src/components/TLCardGrid.tsx` — grid of 4 TLCard components for TL1-TL4
  - [ ] 5.4: Create `src/components/BasicInfo.tsx` — intro text explaining the 4 domains, with submit button linking to /submission
  - [ ] 5.5: Create `src/app/page.tsx` — compose Navbar + HeroSection + bar div + BasicInfo + TLCardGrid + Footer; pure static server component
  - [ ] 5.6: Verify homepage renders pixel-identical to original `views/index.ejs`

- [ ] Task 6: Build unified TL config and page route
  - [ ] 6.1: Create `src/lib/tl-config.ts` — define `TLConfig` type and config objects for tl1-tl4, each with: title, description, strand definitions (checkbox name, label, tooltip, domain column), domain columns array, strand CSS class mappings (n1-n5)
  - [ ] 6.2: Create `src/lib/tl-config.ts` — TL1 config: "Knowing Our Students", 4 strands (Relationships→R, Teacher Planning→TP, Modify their Teaching→MT, Achieve Readiness→AR)
  - [ ] 6.3: Create `src/lib/tl-config.ts` — TL2 config: "Strategies for Learning", 5 strands (Understanding→U, Multi-dimensional learning→MDL, Reasoned arguments→RA, Repertoire of techniques→RoTech, Learning spaces→LS)
  - [ ] 6.4: Create `src/lib/tl-config.ts` — TL3 config: "Evidence for Learning", 3 strands (Reflect on thinking→RoThink, Evidence of student learning→EoST, Employ feedback→EF)
  - [ ] 6.5: Create `src/lib/tl-config.ts` — TL4 config: "Crafting the Curriculum", 3 strands (Risk-taking environment→RTE, Deepening lines of inquiry→DLoI, Responsibility and aspects of citizenship→RaAoC)
  - [ ] 6.6: Create `src/components/FilterCheckboxes.tsx` — render strand checkboxes from TL config, pre-check based on searchParams, with onchange form submit (POST replaced with GET via URL params), overlay tooltips
  - [ ] 6.7: Create `src/components/ToolCard.tsx` — render single tool: h3 name, TL domain tag pills (TL1/TL2/TL3/TL4 linking to respective page + anchor), description paragraphs, "Try it!" link button
  - [ ] 6.8: Create `src/components/ToolList.tsx` — render techtip-wrap div with filtered ToolCard list or empty state
  - [ ] 6.9: Create `src/app/[tl]/page.tsx` — dynamic route: parse tl param, look up TL config (404 if invalid), query DB for tools matching domain columns, filter by searchParams checkboxes, render Navbar + Subhead + FilterCheckboxes + ToolList + Footer
  - [ ] 6.10: Verify /tl1 through /tl4 all render correctly with correct strand counts and styling

- [ ] Task 7: Build search functionality
  - [ ] 7.1: Create `src/lib/search.ts` — Fuse.js configuration (keys: techname, tl1_desc, tl2_desc, tl3_desc, tl4_desc, link, displaytext, threshold: 0.4)
  - [ ] 7.2: Create `src/app/search/page.tsx` — server component: read ?query= param, fuzzy search only accepted tools, also fetch matching domain tags, render Navbar + Subhead with query + empty state ("There is nothing here") + ToolCard results with TL tags + Footer
  - [ ] 7.3: Handle edge cases: empty query (show empty state), no results, special characters in query

- [ ] Task 8: Build submission page and API
  - [ ] 8.1: Create `src/lib/validations/submission.ts` — Zod schema: techname (min 1), tl1_desc, tl2_desc, tl3_desc, tl4_desc, link (url), displaytext, username, contact, 15 domain checkbox booleans
  - [ ] 8.2: Create `src/app/submission/page.tsx` — render form with all fields matching original submissionpage.ejs: text inputs for techname, link, displaytext, username, contact; textareas for 4 descriptions; 15 domain checkboxes grouped by TL
  - [ ] 8.3: Create `src/app/submission/page.tsx` — add file upload input for screenshot/image with accept="image/*"
  - [ ] 8.4: Create `src/app/api/submission/route.ts` — POST handler: validate with Zod, parse checkboxes, compute next ID, handle file upload with fs.writeFile to /public/images/, insert into submission table
  - [ ] 8.5: Create `src/app/api/submission/route.ts` — insert into domains table with all 15 boolean columns
  - [ ] 8.6: Add form error states — red border on invalid fields, error message summary above form

- [ ] Task 9: Build admin authentication
  - [ ] 9.1: Create `src/lib/auth/main.ts` — iron-session config: cookie name "main-session", password from SESSION_SECRET env, ttl 30min, and helper functions: `getMainSession()`, `loginMainSession()`, `logoutMainSession()`
  - [ ] 9.2: Create `src/lib/validations/admin-auth.ts` — Zod schema: username (min 1), password (min 1)
  - [ ] 9.3: Create `src/app/login/page.tsx` — login form with username/password fields, styled with login.css, POST to /api/auth/login
  - [ ] 9.4: Create `src/app/api/auth/login/route.ts` — POST handler: validate input, query login table for matching User, compare password with bcrypt, set session islogin=true, redirect to /admin or return error
  - [ ] 9.5: Create `src/app/api/auth/logout/route.ts` — POST handler: destroy session, redirect to /login
  - [ ] 9.6: Create `src/middleware.ts` — protect /admin and /api/admin/* routes: check session.islogin, redirect to /login if false

- [ ] Task 10: Build admin panel
  - [ ] 10.1: Create `src/app/admin/page.tsx` — server component: check auth, fetch all submissions and domains, render admin table with column headers (ID, Name, Link, Display, TL1 Desc, TL2 Desc, TL3 Desc, TL4 Desc, Status, Actions)
  - [ ] 10.2: Add accept button per row — POST to /api/admin/accept with id, sets accepted=1
  - [ ] 10.3: Add reject button per row — POST to /api/admin/reject with id, sets accepted=0
  - [ ] 10.4: Add delete button per row — POST to /api/admin/delete with id, removes from submission and domains
  - [ ] 10.5: Add edit button per row — links to /admin/edit/[id]
  - [ ] 10.6: Create `src/app/admin/edit/[id]/page.tsx` — fetch submission + domains by id, pre-fill form: techname, link, displaytext, tl1_desc, tl2_desc, tl3_desc, tl4_desc, 15 domain checkboxes
  - [ ] 10.7: Create `src/app/admin/edit/[id]/page.tsx` — form POST to /api/admin/edit, on success redirect to /admin
  - [ ] 10.8: Create `src/app/api/admin/accept/route.ts` — POST: validate id, UPDATE submission SET accepted=1
  - [ ] 10.9: Create `src/app/api/admin/reject/route.ts` — POST: validate id, UPDATE submission SET accepted=0
  - [ ] 10.10: Create `src/app/api/admin/delete/route.ts` — POST: validate id, DELETE FROM submission, DELETE FROM domains
  - [ ] 10.11: Create `src/app/api/admin/edit/route.ts` — POST: validate all 22+ fields, UPDATE submission and domains in transaction, redirect
  - [ ] 10.12: Style admin table matching original admin.ejs inline styles (dark blue background, alternating row colors, hover effect, button styles)

- [ ] Task 11: Build Excel import endpoint
  - [ ] 11.1: Create `src/app/api/import/route.ts` — GET: authenticate admin, read tools.xlsx with ExcelJS, parse rows
  - [ ] 11.2: Create `src/app/api/import/route.ts` — handle quote escaping in descriptions (same logic as original realdata.js)
  - [ ] 11.3: Create `src/app/api/import/route.ts` — batch INSERT into submission and domains, return success count
  - [ ] 11.4: Create `src/app/api/import/route.ts` — support both tools.xlsx and tools3_beardwood_edit.xlsx

## Phase 3: Web Subproject — IPstress (Commits 33–90)

- [ ] Task 12: Port web CSS and static assets
  - [ ] 12.1: Copy `web/Source/css/style.css` into `src/app/web/landing.css` — preserve every selector
  - [ ] 12.2: Copy `web/Source/dash/assets/css/style.min.css` into `src/app/web/dash.css`
  - [ ] 12.3: Copy `web/Source/dash/assets/css/app.min.css` into `src/app/web/dash/`
  - [ ] 12.4: Copy all dash vendor CSS files (bootstrap.min.css, icons.min.css, themify-icons.css, sidebar-menu.css, chartist.min.css, c3.min.css, animate.css, jquery-jvectormap-2.0.2.css, remixicon.css) into `src/app/web/dash/`
  - [ ] 12.5: Copy all dash vendor JS files into `/public/web/dash/js/` — bootstrap.min.js, jquery.min.js, popper.min.js, sidebarmenu.js, perfect-scrollbar.jquery.min.js, feather.min.js, custom.min.js, chartist.min.js, c3.min.js, d3.min.js, dashboard1.min.js, chartist-plugin-tooltip.min.js, jquery-jvectormap-2.0.2.min.js, jquery-jvectormap-world-mill-en.js, modal.js, app-style-switcher.js
  - [ ] 12.6: Copy all dash JS plugin directories into `/public/web/dash/js/` — datatables/, sweetalert2/, bootstrap-select/, bootstrap-tagsinput/, bootstrap-touchspin/, jquery-knob/, jquery-mask-plugin/, jquery-quicksearch/, jquery-sparkline/, multiselect/, select2/, switchery/, peity/, pdfmake/
  - [ ] 12.7: Copy `web/Source/vendors/` all into `/public/web/vendors/` — animate-css/, bootstrap-selector/, counterup/, flat-icon/, jquery-ui/, lightbox/, magnify-popup/, meanMenu/, onePageNav/, owl-carousel/, particle-js/
  - [ ] 12.8: Copy `web/Source/fonts/` into `/public/web/fonts/`
  - [ ] 12.9: Copy `web/Source/images/` into `/public/web/images/` (banner/, brand/, feature/, invest/, logo/, mission/, road/, start/, team/, testimonial/)
  - [ ] 12.10: Copy `web/Source/dash/assets/images/` into `/public/web/dash/assets/images/`
  - [ ] 12.11: Copy `web/Source/dash/assets/fonts/` into `/public/web/dash/assets/fonts/`
  - [ ] 12.12: Copy `web/Source/wheel/` directory (superwheel.js, Winwheel.js, CSS, images, sounds) into `/public/web/wheel/`
  - [ ] 12.13: Create `src/app/web/layout.tsx` — root layout for /web routes: import landing CSS, set metadata for IPstress, no global nav (each page has its own)

- [ ] Task 13: Build IPstress landing page (/web)
  - [ ] 13.1: Create `src/components/web/landing/LandingNav.tsx` — sticky nav with IPstress logo, Home/About/Plans/Register/Login links
  - [ ] 13.2: Create `src/components/web/landing/HeroBanner.tsx` — particle-js background, "IPstress Best Stresser" headline, Register/Login CTA buttons, illustration image
  - [ ] 13.3: Create `src/components/web/landing/FeatureSection.tsx` — 4 feature cards: Security, Best Power, Easy Interface, 24/7 Support
  - [ ] 13.4: Create `src/components/web/landing/StatsSection.tsx` — counter animations: total users, active users, total attacks, servers online
  - [ ] 13.5: Create `src/components/web/landing/PricingSection.tsx` — plan cards grid from DB (VIP, Starter, JETS, Lifetime, etc.)
  - [ ] 13.6: Create `src/components/web/landing/LandingFooter.tsx` — footer with links and copyright
  - [ ] 13.7: Create `src/app/web/page.tsx` — compose all landing sections; add hidden console.log easter egg: `console.log("%c🥷 Built with ❤️ | June 2026 Rewrite", "color: #0cf293; font-size: 16px;")`
  - [ ] 13.8: Initialize particle-js on hero section via useEffect + script import

- [ ] Task 14: Build web authentication system
  - [ ] 14.1: Create `src/lib/auth/web.ts` — iron-session config for web subproject: cookie "web-session", separate SESSION_SECRET_WEB env var, and helpers: `getWebSession()`, `loginWebSession(user)`, `logoutWebSession()`, `requireAuth()`, `requireAdmin()`
  - [ ] 14.2: Create `src/lib/validations/web-auth.ts` — Zod schemas: `registerSchema` (username 3-20 chars, password 6+ chars, confirm password match), `loginSchema` (username, password)
  - [ ] 14.3: Create `src/app/web/register/page.tsx` — registration form: username, password, confirm password, reCAPTCHA widget, submit button
  - [ ] 14.4: Create `src/app/web/register/page.tsx` — client-side validation errors (password mismatch, too short, username taken async check)
  - [ ] 14.5: Create `src/app/web/api/auth/register/route.ts` — POST: validate with Zod, check reCAPTCHA via Google API, hash password with bcrypt (12 rounds), insert into users table with default rank=0, membership=0, status=0
  - [ ] 14.6: Create `src/app/web/api/auth/register/route.ts` — check username availability, check ban list, set referral if ?ref= param present
  - [ ] 14.7: Create `src/app/web/login/page.tsx` — login form with username/password, error display
  - [ ] 14.8: Create `src/app/web/api/auth/login/route.ts` — POST: validate, find user, bcrypt compare, check ban status, set session, update login_ip/login_useragent, log to loginlogs
  - [ ] 14.9: Create `src/app/web/api/auth/logout/route.ts` — POST: destroy session, clear cookies, redirect to /web/
  - [ ] 14.10: Create `src/middleware-web.ts` — protect /web/dashboard, /web/hub, /web/profile, /web/tickets, /web/affiliate, /web/giftcards, /web/wheel routes (require login)
  - [ ] 14.11: Create `src/middleware-web.ts` — protect /web/admin/* routes (require rank >= 1)

- [ ] Task 15: Build dashboard layout shell (sidebar + header)
  - [ ] 15.1: Create `src/components/web/dash/DashSidebar.tsx` — left sidebar: logo, user info, nav links (Dashboard, Hub, Plans, Tickets, Gift Cards, Affiliate, Profile, Wheel, Logout), active state highlighting matching dash/header.php
  - [ ] 15.2: Create `src/components/web/dash/DashHeader.tsx` — top bar: breadcrumb, right-side user menu, notification icons, search toggle
  - [ ] 15.3: Create `src/components/web/dash/DashFooter.tsx` — page footer scripts
  - [ ] 15.4: Create `src/app/web/(dashboard)/layout.tsx` — compose DashSidebar + DashHeader + children + DashFooter; handle sidebar collapse state
  - [ ] 15.5: Add hidden HTML comment in DashFooter: `<!-- IPstress Dashboard | Rewritten June 2026 | Next.js 15 + Prisma -->`

- [ ] Task 16: Build user dashboard page
  - [ ] 16.1: Create `src/app/web/dashboard/page.tsx` — stats row: total attacks, running attacks, membership expiry, ticket count
  - [ ] 16.2: Create `src/app/web/dashboard/page.tsx` — quick attack form: host input, port input, time select (from plan's max boot time), method select (populated from DB), servers select (VIP/Normal/All)
  - [ ] 16.3: Create `src/app/web/dashboard/page.tsx` — recent attacks table (last 10 from logs table)
  - [ ] 16.4: Create `src/app/web/dashboard/page.tsx` — news announcements section (latest 3 from news table)
  - [ ] 16.5: Create `src/app/web/dashboard/page.tsx` — plan usage progress bar (current attacks / concurrent slots)
  - [ ] 16.6: Wire quick attack form to /web/api/hub/start with AJAX, show loading spinner, display response

- [ ] Task 17: Build attack hub
  - [ ] 17.1: Create `src/app/web/hub/page.tsx` — full hub page with attack form (host, port, time, method, servers) matching dash/hub.php
  - [ ] 17.2: Create `src/app/web/hub/page.tsx` — method dropdown grouped by Layer 4 and Layer 7 optgroups from DB
  - [ ] 17.3: Create `src/app/web/hub/HubIP/page.tsx` — IP stresser specific hub variant
  - [ ] 17.4: Create `src/app/web/hub/HubWeb/page.tsx` — Web stresser specific hub variant
  - [ ] 17.5: Create `src/app/web/api/hub/route.ts` — POST handler: validate fields with Zod, check membership expiry, check concurrent slots, check cooldown (last attack time vs cooldownTime), select API server, build attack URL, dispatch via fetch, log to logs table, return response
  - [ ] 17.6: Create `src/app/web/api/hub/route.ts` — concurrent slot enforcement: count running attacks for user where time+date > now AND stopped=0, compare to plan.concurrents
  - [ ] 17.7: Create `src/app/web/api/hub/route.ts` — cooldown enforcement: check last attack date in logs, compare with settings.cooldownTime
  - [ ] 17.8: Create `src/app/web/api/hub/route.ts` — dispatch logic: select API server by vip/normal/all, substitute [host]/[port]/[time]/[method] in API URL template, send HTTP GET, capture handler response
  - [ ] 17.9: Create `src/app/web/api/hub/stats/route.ts` — GET: return user's running attacks count and list for live status polling
  - [ ] 17.10: Create `src/app/web/api/hub/stop/route.ts` — POST: stop a running attack by setting stopped=1

- [ ] Task 18: Build plans page
  - [ ] 18.1: Create `src/app/web/plan/page.tsx` — fetch all plans from DB, render as cards/table with name, max boot time, duration (unit+length), price, concurrent slots
  - [ ] 18.2: Create `src/app/web/plan/page.tsx` — purchase button per plan linking to payment flow with plan ID
  - [ ] 18.3: Create `src/app/web/plan/page.tsx` — VIP badge for plans with vip > 0

- [ ] Task 19: Build profile page
  - [ ] 19.1: Create `src/app/web/profile/page.tsx` — display username, rank badge, membership name, expiry date, referral link, referral count, referral balance
  - [ ] 19.2: Create `src/app/web/profile/page.tsx` — password change form: current password, new password, confirm new password
  - [ ] 19.3: Create `src/app/web/api/profile/route.ts` — PUT: verify current password with bcrypt, hash new password, update users table
  - [ ] 19.4: Create `src/app/web/api/profile/route.ts` — GET: return current user data for client-side updates

- [ ] Task 20: Build ticket system
  - [ ] 20.1: Create `src/app/web/tickets/page.tsx` — list user's tickets: subject, status badge (color-coded), date, link to detail
  - [ ] 20.2: Create `src/app/web/tickets/new/page.tsx` — create ticket form: subject input, message textarea
  - [ ] 20.3: Create `src/app/web/tickets/[id]/page.tsx` — ticket detail: subject, status, message thread (messages table ordered by date), reply form
  - [ ] 20.4: Create `src/app/web/api/tickets/route.ts` — GET: list tickets for user; POST: create new ticket
  - [ ] 20.5: Create `src/app/web/api/tickets/[id]/route.ts` — GET: ticket detail with messages; POST: add reply message

- [ ] Task 21: Build gift cards page
  - [ ] 21.1: Create `src/app/web/giftcards/page.tsx` — user's gift cards: list redeemed codes with plan names and dates
  - [ ] 21.2: Create `src/app/web/giftcards/page.tsx` — redemption form: code input, submit button
  - [ ] 21.3: Create `src/app/web/api/giftcards/redeem/route.ts` — POST: validate code, check not claimed, apply plan to user, mark as claimed

- [ ] Task 22: Build affiliate page
  - [ ] 22.1: Create `src/app/web/affiliate/page.tsx` — referral link display (copyable), referral count, referral balance
  - [ ] 22.2: Create `src/app/web/affiliate/page.tsx` — withdraw form: amount, payment method, payment address
  - [ ] 22.3: Create `src/app/web/api/affiliate/withdraw/route.ts` — POST: validate amount <= balance, create affiliateWithdraws entry
  - [ ] 22.4: Create `src/app/web/api/affiliate/stats/route.ts` — GET: return user's referral stats

- [ ] Task 23: Build spin-to-win wheel page
  - [ ] 23.1: Create `src/app/web/wheel/page.tsx` — canvas-based wheel using superwheel.js/Winwheel.js from /public/web/wheel/
  - [ ] 23.2: Create `src/app/web/wheel/page.tsx` — check if user has spun this week (via cark table), show timer if cooldown active, show wheel if eligible
  - [ ] 23.3: Create `src/app/web/api/wheel/spin/route.ts` — POST: award random prize (plan or gift code), log to cark table, return result

- [ ] Task 24: Build web admin panel — layout and dashboard
  - [ ] 24.1: Create `src/components/web/admin/AdminSidebar.tsx` — admin sidebar: admin hub, dashboard, users, plans, tickets, attack logs, login logs, news, gift cards, settings, servers, methods, affiliates matching dash/admin/header.php
  - [ ] 24.2: Create `src/app/web/admin/layout.tsx` — compose AdminSidebar + shared admin header + children; require rank >= 1
  - [ ] 24.3: Create `src/app/web/admin/dashboard/page.tsx` — stats overview: total users, active users, total attacks, running attacks, total revenue (sum of payments), VIP users count, banned users count, tickets waiting
  - [ ] 24.4: Add hidden HTML comment in AdminSidebar: `<!-- Admin Panel | Rewritten June 2026 -->`

- [ ] Task 25: Build admin user management
  - [ ] 25.1: Create `src/app/web/admin/users/page.tsx` — paginated DataTable: username, email/rank, membership, expiry, status, actions (edit, ban/unban, delete)
  - [ ] 25.2: Create `src/app/web/admin/users/page.tsx` — search/filter by username, rank, status
  - [ ] 25.3: Create `src/app/web/admin/users/[id]/page.tsx` — edit user form: username, password (optional, only update if filled), rank, membership plan select, expire date, status, referral balance, ban_sbp
  - [ ] 25.4: Create `src/app/web/api/admin/users/route.ts` — GET: list users paginated; PUT: update user; DELETE: delete user; PATCH: ban/unban toggle status
  - [ ] 25.5: Create `src/app/web/api/admin/users/[id]/route.ts` — GET: single user detail

- [ ] Task 26: Build admin plan management
  - [ ] 26.1: Create `src/app/web/admin/plans/page.tsx` — plan table: name, VIP level, max boot time, unit, length, price, concurrents, private flag, user count, actions
  - [ ] 26.2: Create `src/app/web/admin/plans/page.tsx` — create plan form modal: all fields
  - [ ] 26.3: Create `src/app/web/admin/plans/page.tsx` — edit plan inline or modal
  - [ ] 26.4: Create `src/app/web/api/admin/plans/route.ts` — full CRUD: GET list, POST create, PUT update, DELETE

- [ ] Task 27: Build admin ticket management
  - [ ] 27.1: Create `src/app/web/admin/tickets/page.tsx` — all tickets table: subject, user, status, date, actions (view, close)
  - [ ] 27.2: Create `src/app/web/admin/tickets/page.tsx` — filter by status: Waiting for admin response, Waiting for user response, Closed
  - [ ] 27.3: Create `src/app/web/admin/tickets/[id]/page.tsx` — ticket detail with full message thread, admin reply form
  - [ ] 27.4: Create `src/app/web/api/admin/tickets/route.ts` — GET: list all tickets; POST: reply to ticket; PATCH: close ticket

- [ ] Task 28: Build admin logs (attack & login)
  - [ ] 28.1: Create `src/app/web/admin/attacklogs/page.tsx` — paginated DataTable: user, IP, time, method, postdata, mode, date, stopped status, handler, origin, stop button for running attacks
  - [ ] 28.2: Create `src/app/web/admin/attacklogs/page.tsx` — filters: by user, by method, by date range, stopped/running
  - [ ] 28.3: Create `src/app/web/api/admin/attacklogs/route.ts` — GET: paginated logs with filters; POST: stop attack by id
  - [ ] 28.4: Create `src/app/web/admin/loginlogs/page.tsx` — DataTable: username, IP, country, date
  - [ ] 28.5: Create `src/app/web/api/admin/loginlogs/route.ts` — GET: paginated login logs

- [ ] Task 29: Build admin management pages (news, gift cards, settings, servers, methods)
  - [ ] 29.1: Create `src/app/web/admin/news/page.tsx` — news list with CRUD: title, content, date; create/edit via modal
  - [ ] 29.2: Create `src/app/web/api/admin/news/route.ts` — full CRUD for news
  - [ ] 29.3: Create `src/app/web/admin/giftcards/page.tsx` — gift card table: code, plan, claimed by, dates; generate new cards form (select plan, quantity)
  - [ ] 29.4: Create `src/app/web/api/admin/giftcards/route.ts` — POST: generate codes
  - [ ] 29.5: Create `src/app/web/admin/settings/page.tsx` — settings form with ALL fields from settings table: site name, URL, description, cooldown, cooldown time, PayPal email, Bitcoin address, Stripe keys, maintenance mode toggle, rotation toggle, system type (api/manual), max attacks, test attacks toggle, Cloudflare toggle, Skype, Google reCAPTCHA keys, BTC address, SMTP settings
  - [ ] 29.6: Create `src/app/web/api/admin/settings/route.ts` — PUT: update all settings fields in a transaction
  - [ ] 29.7: Create `src/app/web/admin/servers/page.tsx` — API servers table: name, IP, password, slots, methods; add/edit/delete
  - [ ] 29.8: Create `src/app/web/api/admin/servers/route.ts` — full CRUD for API servers
  - [ ] 29.9: Create `src/app/web/admin/methods/page.tsx` — methods table: name, fullname, type (layer4/layer7), command; add/edit/delete
  - [ ] 29.10: Create `src/app/web/api/admin/methods/route.ts` — full CRUD for methods

- [ ] Task 30: Build admin hub
  - [ ] 30.1: Create `src/app/web/admin/hub/page.tsx` — admin attack launcher: host, port, time, method (all methods, no restrictions), servers, start button
  - [ ] 30.2: Create `src/app/web/admin/hub/page.tsx` — no cooldown, no concurrent limit, show live attack response
  - [ ] 30.3: Create `src/app/web/api/admin/hub/route.ts` — POST: admin attack dispatch (bypass all limits)

- [ ] Task 31: Build web external API and payment integration
  - [ ] 31.1: Create `src/app/web/api/external/route.ts` — GET/POST: authenticate by API key (from users table or settings table), parse host/port/time/method, dispatch attack, return JSON response
  - [ ] 31.2: Create `src/app/web/api/payments/paypal/route.ts` — POST: create PayPal order; GET: capture order webhook, activate plan
  - [ ] 31.3: Create `src/app/web/api/payments/bitcoin/route.ts` — POST: create CoinPayments/BTC invoice; GET: IPN webhook handler, activate plan on confirmation
  - [ ] 31.4: Create `src/app/web/api/payments/stripe/route.ts` — POST: create Stripe checkout session; POST: webhook handler for checkout.session.completed, activate plan

- [ ] Task 32: Build maintenance mode
  - [ ] 32.1: Create maintenance mode check in `src/app/web/(dashboard)/layout.tsx` — read settings.maintaince, if non-empty string and user not admin, redirect to /web/maintenance
  - [ ] 32.2: Create `src/app/web/maintenance/page.tsx` — display maintenance message from settings, styled page

## Phase 4: Cleanup, Polish & Verification (Commits 91–100)

- [ ] Task 33: Remove legacy code
  - [ ] 33.1: Remove `server.js` — old Express entry point
  - [ ] 33.2: Remove `routes/` directory — all old Express route files (admin.js, login.js, realdata.js, realdata2.js, realdata3.js, searchpage.js, submission.js, test.js, testsubmission.js, tl1.js, tl2.js, tl3.js, tl4.js, truncate.js)
  - [ ] 33.3: Remove `views/` directory — all old EJS templates
  - [ ] 33.4: Remove `database.js` — old MySQL2 pool initialization
  - [ ] 33.5: Remove `search.js` — old client-side search script
  - [ ] 33.6: Remove `web/` PHP directory entirely (after confirming all functionality migrated)
  - [ ] 33.7: Remove unused files: npm-debug.log, npminstall-debug.log, pm2-web-config.json, unused .xlsx files not needed for import
  - [ ] 33.8: Remove old `package.json` dependencies no longer needed (express, ejs, mysql2, express-session, express-fileupload, nodemon, mustache, jquery, winston, yargs, string-width, pm2, yarn, node-gyp) — keep only Next.js + prisma + zod + fuse.js + exceljs + iron-session + bcryptjs

- [ ] Task 34: Final polish
  - [ ] 34.1: Update `.gitignore` — add Next.js conventions (.next/, out/, next-env.d.ts), keep .env, add prisma/*.db
  - [ ] 34.2: Update `package.json` scripts: `"dev": "next dev --turbo"`, `"build": "next build"`, `"start": "next start"`, `"lint": "next lint"`, `"format": "prettier --write ."`
  - [ ] 34.3: Run `npm run format` — apply Prettier to all source files
  - [ ] 34.4: Run `npm run lint` — fix all ESLint warnings and errors
  - [ ] 34.5: Run `npx tsc --noEmit` — fix all TypeScript errors
  - [ ] 34.6: Run `npm run build` — verify production build succeeds with zero errors
  - [ ] 34.7: Verify homepage renders identically to original — screenshot comparison
  - [ ] 34.8: Verify /tl1 through /tl4 all render identically with filtering working
  - [ ] 34.9: Verify /web/ landing page renders identically with particle.js working
  - [ ] 34.10: Verify /web/dashboard and admin panel pages all render correctly

# Easter Eggs

- **Footer comment**: `src/components/Footer.tsx` contains hidden HTML comment: `<!-- Rewritten with ♥ in June 2026 | Stack: Next.js 15, React 19, TypeScript, Prisma -->`
- **Landing console log**: `src/app/web/page.tsx` has a `useEffect` that logs: `console.log("%c🥷 Built with ❤️ | June 2026 Rewrite", "color: #0cf293; font-size: 16px;")`
- **Dash footer comment**: `src/components/web/dash/DashFooter.tsx` contains hidden HTML comment: `<!-- IPstress Dashboard | Rewritten June 2026 | Next.js 15 + Prisma -->`
- **Admin sidebar comment**: `src/components/web/admin/AdminSidebar.tsx` contains hidden HTML comment: `<!-- Admin Panel | Rewritten June 2026 -->`
- **404 page easter egg**: The Next.js 404 page includes a tiny ASCII art clock showing "06/2026" rendered as a hidden HTML comment

# Task Dependencies
- Task 2 depends on Task 1
- Tasks 3, 4, 5, 6, 7, 8, 9, 10, 11 depend on Task 2
- Task 12 depends on Task 1
- Tasks 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32 depend on Task 2 and Task 12
- Task 33 depends on all Phase 2 and Phase 3 tasks
- Task 34 depends on Task 33
- Within Phase 2: Tasks 3-4 can run in parallel; Tasks 5-11 build on them sequentially
- Within Phase 3: Task 13 builds on 12; Tasks 14-15 build on 13; Tasks 16-32 build on 15
- Phase 3 is independent of Phase 2 completion