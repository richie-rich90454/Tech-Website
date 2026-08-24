/**
 * SYNC DIST - mirrors src/views + public/ into dist/ for production.
 * rmSync first so deleted sources never linger as stale build output.
 * Also vendors the IE11 CSS-custom-properties polyfill into public/js/vendor.
 */
import { cpSync, mkdirSync, copyFileSync, rmSync } from 'node:fs';

rmSync('dist/public', { recursive: true, force: true });
cpSync('src/views', 'dist/views', { recursive: true });
cpSync('public', 'dist/public', { recursive: true });

// Vendored third-party browser polyfill (IE11 custom properties).
mkdirSync('public/js/vendor', { recursive: true });
copyFileSync(
    'node_modules/ie11-custom-properties/ie11CustomProperties.js',
    'public/js/vendor/ie11-custom-properties.js'
);
console.log('dist assets synced');
