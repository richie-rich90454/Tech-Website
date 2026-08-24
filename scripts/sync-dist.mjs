/**
 * SYNC DIST - assembles the deployable dist/ tree (Vite-style).
 *
 *   public/**        -> dist/public/**      passthrough assets, byte-identical
 *   src/views/**     -> dist/views/**       EJS templates
 *   src/styles/*.css -> dist/public/css/    via PostCSS (autoprefixer, ie11)
 *   src/client/*.ts  -> dist/public/js/     via tsc ES5 (own build step)
 *
 * rmSync first so deleted sources never linger as stale build output.
 */
import { cpSync, mkdirSync, copyFileSync, rmSync } from "node:fs";

rmSync("dist/public", { recursive: true, force: true });
cpSync("src/views", "dist/views", { recursive: true });
cpSync("public", "dist/public", { recursive: true });

// Vendored third-party browser polyfill (IE11 custom properties).
mkdirSync("dist/public/js/vendor", { recursive: true });
copyFileSync(
    "node_modules/ie11-custom-properties/ie11CustomProperties.js",
    "dist/public/js/vendor/ie11-custom-properties.js"
);

// Compiled CSS lands in the same tree the server serves.
cpSync("src/styles", "dist/public/css", { recursive: true });

console.log("dist assets synced");
