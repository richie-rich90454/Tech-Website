/**
 * DEV ASSET SYNC - populates dist/public with passthrough assets (images,
 * fonts, seeded screenshots, legacy web assets) WITHOUT touching the
 * compiler outputs (js/, css/) that the dev watchers own.
 *
 * `npm run build` performs a full clean sync via scripts/sync-dist.mjs; this
 * lighter variant exists so `npm run dev` is self-sufficient on a fresh
 * clone - no prior build required for images and fonts to resolve.
 */
import { cpSync, mkdirSync } from 'node:fs';

mkdirSync('dist/public', { recursive: true });
cpSync('public', 'dist/public', { recursive: true });
console.log('[assets] public -> dist/public synced (js/css untouched)');
