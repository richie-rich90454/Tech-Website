# Verification Checklist

## Main App — BIBS-C Tech Tools

- [ ] Next.js dev server starts with `npm run dev` on port 3000
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] ESLint passes with zero errors (`npm run lint`)
- [ ] Prettier formatting is consistent (`npm run format`)
- [ ] `npm run build` succeeds with zero errors
- [ ] Homepage (/) renders navbar, hero, 4 TL cards, footer matching original
- [ ] /tl1 renders with 4 strand checkboxes, filtered tool list, correct TL1 styling
- [ ] /tl2 renders with 5 strand checkboxes, filtered tool list, correct TL2 styling
- [ ] /tl3 renders with 3 strand checkboxes, filtered tool list, correct TL3 styling
- [ ] /tl4 renders with 3 strand checkboxes, filtered tool list, correct TL4 styling
- [ ] Strand filter checkboxes update results via URL searchParams
- [ ] Each ToolCard displays: name, tl1-4 descriptions, link button, TL domain tags
- [ ] /search?query=test returns fuzzy-matched results with TL tags
- [ ] Empty search shows "There is nothing here" message
- [ ] /submission form validates required fields (Zod), shows field-level errors
- [ ] /submission file upload saves image to /public/images/
- [ ] /submission inserts into submission and domains tables, redirects to /
- [ ] /login shows login form, authenticates with bcrypt against DB
- [ ] Invalid login shows error message
- [ ] /admin redirects to /login when unauthenticated
- [ ] /admin lists all submissions in table with accept/reject/edit/delete
- [ ] Accept button sets accepted=1 via API
- [ ] Reject button sets accepted=0 via API
- [ ] Delete button removes from submission and domains via API
- [ ] Edit form pre-fills all fields (techname, link, descriptions, displaytext, domain checkboxes)
- [ ] Edit form saves all changes correctly via API
- [ ] Excel import endpoint parses tools.xlsx and inserts rows via API
- [ ] All CSS matches original visual design (colors, fonts, spacing, layout)

## Web Subproject — IPstress

- [ ] /web/ landing page matches original HTML exactly (hero, features, stats, pricing, footer)
- [ ] Particle.js background animation works on landing page
- [ ] /web/register form validates with Zod, hashes password with bcrypt
- [ ] /web/register reCAPTCHA integration works
- [ ] /web/login authenticates with bcrypt, creates iron-session
- [ ] Invalid login shows error message on /web/login
- [ ] Logout clears session and redirects to /web/
- [ ] /web/dashboard shows membership info, expiry, concurrent slots
- [ ] /web/dashboard quick-attack form is functional
- [ ] /web/dashboard shows news announcements from DB
- [ ] /web/hub displays full attack form with method/server selects
- [ ] /web/hub enforces concurrent slot limits and cooldown
- [ ] /web/hub dispatches attack to external API and logs it
- [ ] /web/hub shows live attack status
- [ ] /web/plan lists all membership plans with pricing
- [ ] /web/profile shows user info and allows password change
- [ ] /web/tickets lists user's tickets with status
- [ ] /web/tickets/new creates ticket with subject and message
- [ ] /web/tickets/[id] shows message thread with reply form
- [ ] /web/giftcards redeems valid codes and applies plan
- [ ] /web/giftcards shows error for invalid/redeemed codes
- [ ] /web/affiliate shows referral link, count, and balance
- [ ] /web/wheel spin-to-win works with superwheel.js
- [ ] /web/admin/* is protected (rank >= 1 required)
- [ ] /web/admin/dashboard shows total users, active users, attacks, revenue
- [ ] /web/admin/users lists all users with edit/ban/delete
- [ ] /web/admin/users/[id] edit form saves changes
- [ ] /web/admin/plans CRUD works (create, edit, delete plans)
- [ ] /web/admin/tickets admin can reply to and close tickets
- [ ] /web/admin/attacklogs shows paginated attack history
- [ ] /web/admin/loginlogs shows login history with IP and country
- [ ] /web/admin/news CRUD works
- [ ] /web/admin/giftcards generates new gift codes
- [ ] /web/admin/settings saves all site settings
- [ ] /web/admin/servers manages API server entries
- [ ] /web/admin/methods manages Layer 4/Layer 7 methods
- [ ] /web/admin/hub launches attacks without cooldown
- [ ] /web/api external endpoint accepts authenticated attack requests
- [ ] PayPal payment flow creates payment and activates plan on webhook
- [ ] Bitcoin payment flow creates invoice and activates on confirmation
- [ ] Stripe payment flow creates session and activates on webhook
- [ ] Maintenance mode shows maintenance page for non-admin users
- [ ] Web sidebar/header matches original dash/header.php
- [ ] Web admin sidebar matches original dash/admin/header.php
- [ ] All web CSS matches original visual design (dashboard, tables, forms, modals)

## Easter Eggs

- [ ] Main app footer HTML source contains `<!-- Rewritten with ♥ in June 2026 | Stack: Next.js 15, React 19, TypeScript, Prisma -->`
- [ ] Browser console on /web/ shows styled `🥷 Built with ❤️ | June 2026 Rewrite` log
- [ ] /web/dashboard page source contains `<!-- IPstress Dashboard | Rewritten June 2026 | Next.js 15 + Prisma -->`
- [ ] /web/admin/* page source contains `<!-- Admin Panel | Rewritten June 2026 -->`
- [ ] 404 page source contains ASCII art clock `06/2026` as hidden HTML comment

## Cross-Cutting

- [ ] Environment variables used for all credentials (no hardcoded values)
- [ ] web/ PHP directory removed after migration confirmed
- [ ] Old Express files removed (server.js, routes/, views/, database.js, search.js)
- [ ] .gitignore updated for Next.js conventions
- [ ] Responsive design works on mobile viewport for both apps