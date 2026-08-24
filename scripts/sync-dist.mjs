/**
 * SYNC DIST - mirrors src/views + public/ into dist/ for production.
 * rmSync first so deleted sources never linger as stale build output.
 */
import { cpSync, rmSync } from 'node:fs';

rmSync('dist/public', { recursive: true, force: true });
cpSync('src/views', 'dist/views', { recursive: true });
cpSync('public', 'dist/public', { recursive: true });
console.log('dist assets synced');
