#!/usr/bin/env bash
# Deploys Tech-Website on a plain VPS (no Docker).
# Prereqs: Node 18/20, build-essential + python3 (for better-sqlite3), nginx, certbot.
set -euo pipefail

APP_DIR="/opt/tech-website"
SERVICE="tech-website"

cd "$APP_DIR"

echo "==> Pulling latest code"
git pull --ff-only

echo "==> Installing production dependencies (CVE-audited lockfile)"
npm ci --omit=dev

# Dev deps are needed for the build (next build, drizzle-kit). Reinstall full tree.
echo "==> Installing dev deps for build"
npm ci

if [ -f prisma/main.db ] && [ -f prisma/web.db ]; then
    echo "==> Databases exist; syncing schema only"
    npx drizzle-kit push --config=drizzle.main.config.ts || true
    npx drizzle-kit push --config=drizzle.web.config.ts || true
else
    echo "==> Creating fresh databases"
    npm run db:init
    npm run db:seed
fi

echo "==> Building"
npm run build

echo "==> Restarting service"
sudo systemctl restart "$SERVICE"
sleep 2
systemctl is-active --quiet "$SERVICE" && echo "==> Deploy complete: service is active" || {
    echo "!! Service failed to start. Check: journalctl -u $SERVICE -n 50"
    exit 1
}
