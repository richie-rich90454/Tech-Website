# Rewrite BIBS-C Tech Tools + IPstress Subproject Spec

## Why
The current codebase is split into two parts:
1. **Main app**: A monolithic Express/EJS/MySQL BIBS-C Tech Tools website with massive code duplication (tl1-4 routes are nearly identical), no type safety, manual SQL string escaping, hardcoded credentials, and poor separation of concerns.
2. **Subproject (`web/`)**: A PHP/MySQL DDoS IP stresser service ("IPstress") with user dashboard, admin panel, payment integration, ticket system, affiliate system, and attack launching — all built with raw PDO queries, SHA1(md5()) password hashing, and no input validation framework.

The goal is to rewrite both projects with identical UI/UX using Next.js 15 + React 19 + TypeScript + Prisma ORM, delivering modern DX, type safety, and maintainability.

## What Changes
- **BREAKING**: Replace Express/EJS main app with Next.js 15 (App Router) + React 19 + TypeScript
- **BREAKING**: Replace PHP `web/` subproject with Next.js 15 (App Router) + React 19 + TypeScript, served under `/web/` path
- Replace raw MySQL2 queries with Prisma ORM across both projects
- DRY the 4 nearly-identical TL routes into a single parameterized route/template
- Replace manual string escaping with proper React JSX encoding
- Move all hardcoded credentials to environment variables
- Add Zod input validation on all form submissions across both apps
- Add proper error handling, loading states, and toast notifications
- Preserve exact CSS visual design by porting existing CSS files as-is with Tailwind only for layout utilities
- Add ESLint + Prettier for code quality
- Replace SHA1(md5()) with bcryptjs for password hashing
- Replace manual session management with iron-session
- Remove all unused legacy dependencies

## Impact
- Affected specs: N/A (greenfield rewrite)
- Affected code: Entire codebase
- Main database schema stays the same (MySQL: submission, domains, login)
- Web database schema stays the same (MySQL: users, logs, plans, tickets, payments, settings, etc.)

---

## ADDED Requirements — Main App (BIBS-C Tech Tools)

### Requirement: Type-Safe Full-Stack Architecture
The system SHALL use Next.js 15 App Router with TypeScript and React 19, providing SSR for all public pages and API routes for mutations.

#### Scenario: Developer opens the project
- **WHEN** a developer clones the repo and runs `npm install && npm run dev`
- **THEN** they get a fully type-checked Next.js dev server with Turbopack HMR on port 3000

### Requirement: Unified TL Page Route
The system SHALL serve all four TL category pages (tl1, tl2, tl3, tl4) via a single parameterized route `/[tl]/page.tsx`, eliminating ~600 lines of duplicated code.

#### Scenario: User visits /tl1
- **WHEN** a user navigates to /tl1
- **THEN** they see TL1: Knowing Our Students with its 4 strands and matching tools

#### Scenario: User visits /tl3
- **WHEN** a user navigates to /tl3
- **THEN** they see TL3: Evidence for Learning with its 3 strands and matching tools

### Requirement: Prisma ORM Database Layer (Main DB)
The system SHALL use Prisma with the existing MySQL schema, providing type-safe queries.

#### Scenario: Developer queries accepted tools
- **WHEN** a developer writes `prisma.submission.findMany({ where: { accepted: true } })`
- **THEN** they get fully typed results without manual SQL

### Requirement: Input Validation
All form submissions (login, new tech tool submission, admin edit, search) SHALL be validated with Zod schemas before processing.

#### Scenario: User submits a tech tool with missing name
- **WHEN** a user submits the form with an empty techname field
- **THEN** the server returns a validation error with a descriptive message

### Requirement: Admin Panel with Session Auth
The system SHALL provide an iron-session-authenticated admin panel for accepting/rejecting/editing/deleting tech tool submissions.

#### Scenario: Admin logs in with correct credentials
- **WHEN** an admin POSTs valid credentials to /api/auth/login
- **THEN** they are redirected to /admin where they see all submissions

#### Scenario: Unauthenticated user tries to access /admin
- **WHEN** a user without a valid session navigates to /admin
- **THEN** they are redirected to /login

### Requirement: Fuzzy Search
The system SHALL provide fuzzy search across all accepted tech tools using Fuse.js on the server.

#### Scenario: User searches for "canvas"
- **WHEN** a user enters "canvas" in the search bar at /search?query=canvas
- **THEN** they see results with all matching tools tagged with their TL domains

### Requirement: Excel Data Import
The system SHALL provide an admin-only endpoint to import tech tools from Excel files.

#### Scenario: Admin hits import endpoint
- **WHEN** an admin navigates to /api/import
- **THEN** the server reads tools.xlsx, parses rows, and inserts into the submission and domains tables

### Requirement: Identical Visual Design (Main App)
The system SHALL render the exact same visual appearance as the current EJS templates.

#### Scenario: User views the homepage
- **WHEN** a user loads the homepage
- **THEN** they see the same "BIBS·C Tech Tools" header, 4 TL domain cards, navbar, footer, and styling

---

## ADDED Requirements — Web Subproject (IPstress)

### Requirement: IPstress Landing Page
The system SHALL serve a landing page at `/web/` with the same hero section, feature highlights, pricing, and navigation.

#### Scenario: Visitor opens /web/
- **WHEN** a visitor navigates to /web/
- **THEN** they see the IPstress branding, registration/login CTAs, feature sections, and footer

### Requirement: User Registration with Validation
The system SHALL provide user registration at /web/register with Zod validation, bcrypt password hashing, and reCAPTCHA.

#### Scenario: User registers with valid data
- **WHEN** a user submits a valid registration form
- **THEN** a new user is created in the database with bcrypt-hashed password and they are redirected to login

### Requirement: User Login with Session
The system SHALL authenticate users at /web/login using iron-session and bcrypt comparison.

#### Scenario: User logs in with correct credentials
- **WHEN** a user submits valid username/password
- **THEN** they are redirected to /web/dashboard with an active session

### Requirement: User Dashboard
The system SHALL show a dashboard at /web/dashboard displaying user stats, membership info, quick-attack form, and recent activity.

#### Scenario: Logged-in user views dashboard
- **WHEN** a user navigates to /web/dashboard
- **THEN** they see their plan details, concurrent slots, attack form, running attacks, and ticket count

### Requirement: Attack Hub (Launch Attacks)
The system SHALL provide attack launching at /web/hub where users input host, port, time, method, and trigger attacks via external API servers.

#### Scenario: User launches an attack
- **WHEN** a user fills in host, port, time, method and clicks Start
- **THEN** the server dispatches the attack to available API servers, logs it, and shows live status

### Requirement: Plans & Pricing Page
The system SHALL render a plans page at /web/plan listing all available membership tiers with name, duration, price, concurrent slots, and purchase CTAs.

#### Scenario: User browses plans
- **WHEN** a user visits /web/plan
- **THEN** they see a table of plans with prices and a purchase button per plan

### Requirement: User Profile Management
The system SHALL allow users to view and update their profile at /web/profile.

#### Scenario: User changes password
- **WHEN** a user submits a new password on /web/profile
- **THEN** the password is bcrypt-hashed and updated in the database

### Requirement: Support Ticket System
The system SHALL provide a ticket system at /web/tickets where users create, view, and reply to support tickets.

#### Scenario: User creates a ticket
- **WHEN** a user submits a subject and message
- **THEN** a new ticket is created with status "Waiting for admin response"

### Requirement: Gift Card Redemption
The system SHALL allow users to redeem gift codes at /web/giftcards.

#### Scenario: User redeems a valid code
- **WHEN** a user enters a valid unredeemed gift code
- **THEN** the corresponding plan is applied to their account

### Requirement: Affiliate System
The system SHALL provide affiliate tracking at /web/affiliate showing referral link, referral count, and referral balance.

#### Scenario: User views affiliate page
- **WHEN** a logged-in user visits /web/affiliate
- **THEN** they see their unique referral link, referral count, and balance

### Requirement: Spin-to-Win Wheel
The system SHALL provide a weekly spin wheel at /web/wheel where users can win prizes (plans, gift codes).

#### Scenario: User spins the wheel
- **WHEN** a user who hasn't spun this week visits /web/wheel and clicks spin
- **THEN** a random prize is awarded and logged

### Requirement: Admin Panel (Web Subproject)
The system SHALL provide a full admin panel at /web/admin/* with role-based access (rank >= 1).

#### Scenario: Admin views admin dashboard
- **WHEN** an admin navigates to /web/admin/dashboard
- **THEN** they see total users, active users, total attacks, running attacks, revenue stats

#### Scenario: Admin manages users
- **WHEN** an admin visits /web/admin/users
- **THEN** they see a paginated table of all users with edit/ban/delete actions

#### Scenario: Admin manages plans
- **WHEN** an admin visits /web/admin/plans
- **THEN** they can create, edit, and delete membership plans

#### Scenario: Admin manages tickets
- **WHEN** an admin visits /web/admin/tickets
- **THEN** they see all tickets with ability to reply and close

#### Scenario: Admin views attack logs
- **WHEN** an admin visits /web/admin/attacklogs
- **THEN** they see a paginated table of all attack logs with filters

#### Scenario: Admin views login logs
- **WHEN** an admin visits /web/admin/loginlogs
- **THEN** they see a table of user login history with IP and country

#### Scenario: Admin manages news
- **WHEN** an admin visits /web/admin/news
- **THEN** they can create, edit, and delete news announcements shown on dashboard

#### Scenario: Admin manages gift cards
- **WHEN** an admin visits /web/admin/giftcards
- **THEN** they can generate new gift codes tied to plans

#### Scenario: Admin manages site settings
- **WHEN** an admin visits /web/admin/settings
- **THEN** they can update site name, cooldown, payment keys, maintenance mode, and other settings

#### Scenario: Admin manages API servers
- **WHEN** an admin visits /web/admin/servers
- **THEN** they can add, edit, and remove external API servers used for attacks

#### Scenario: Admin manages attack methods
- **WHEN** an admin visits /web/admin/methods
- **THEN** they can add, edit, and remove Layer 4/Layer 7 attack methods

#### Scenario: Admin launches attacks from hub
- **WHEN** an admin visits /web/admin/hub
- **THEN** they can launch attacks with any method/server combination without cooldown

### Requirement: API Endpoint for External Attack Triggers
The system SHALL expose /web/api.php (rewritten as /web/api) accepting authenticated attack requests from external systems.

#### Scenario: External system sends attack via API
- **WHEN** a POST request with valid key, host, port, time, method is sent to /web/api
- **THEN** the attack is dispatched and logged

### Requirement: Payment Integration
The system SHALL support payment processing via PayPal, Bitcoin, and Stripe for plan purchases.

#### Scenario: User purchases a plan
- **WHEN** a user completes payment through PayPal/Bitcoin/Stripe
- **THEN** the plan is activated on their account with the correct expiry

### Requirement: Maintenance Mode
The system SHALL support a maintenance mode toggle that shows a maintenance page to non-admin users.

#### Scenario: Admin enables maintenance mode
- **WHEN** admin sets maintenance mode in settings
- **THEN** all non-admin users see a maintenance page instead of the normal site

### Requirement: Identical Visual Design (Web Subproject)
The system SHALL render the exact same visual appearance as the current PHP templates, preserving all CSS from `web/Source/css/style.css`, `web/Source/dash/assets/css/style.min.css`, and all vendor CSS.

#### Scenario: User views the IPstress landing page
- **WHEN** a user loads /web/
- **THEN** they see the same hero banner, feature cards, stats counters, and footer as the original

### Requirement: Easter Egg — 2026/06 Rewrite Signature
The system SHALL contain hidden indicators marking this as a June 2026 rewrite, discoverable by curious developers.

#### Scenario: Developer inspects page source
- **WHEN** a developer views the HTML source of any main app page
- **THEN** they find a hidden HTML comment in the footer: `<!-- Rewritten with ♥ in June 2026 | Stack: Next.js 15, React 19, TypeScript, Prisma -->`

#### Scenario: Developer opens browser console on IPstress landing page
- **WHEN** a developer opens DevTools console on /web/
- **THEN** they see a styled console.log: `🥷 Built with ❤️ | June 2026 Rewrite`

#### Scenario: Developer inspects dashboard or admin panel
- **WHEN** a developer views source of /web/dashboard or /web/admin pages
- **THEN** they find hidden HTML comments marking the rewrite date and stack

#### Scenario: Developer lands on 404 page
- **WHEN** a user navigates to a non-existent route
- **THEN** the 404 page source contains a tiny ASCII art clock reading "06/2026" as a hidden HTML comment

## REMOVED Requirements

### Requirement: Duplicate TL Route Files
**Reason**: routes/tl1.js, tl2.js, tl3.js, tl4.js are ~95% identical copy-paste.
**Migration**: Replace with a single parameterized route `/[tl]/page.tsx` driven by a config object.

### Requirement: SHA1(md5()) Password Hashing
**Reason**: Insecure; SHA1 and MD5 are both cryptographically broken.
**Migration**: Replace with bcryptjs across both apps. Existing passwords must be re-hashed on next login.

### Requirement: Manual SQL String Escaping
**Reason**: routes/admin.js contains ~120 lines of regex replace calls to escape strings for JS embedding.
**Migration**: React/JSX handles encoding automatically; Prisma handles SQL parameterization.