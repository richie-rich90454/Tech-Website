#!/usr/bin/env node
/**
 * BUILD-TIME PRECOMPRESSION
 *
 * For every text asset under public/ this writes a .gz and .br sibling so the
 * runtime static server (src/core/07-static.ts) can serve compressed bytes with
 * ZERO per-request CPU. Compression happens once here, not per visitor.
 *
 * Which files: css, js, svg, json, txt, html - the formats where compression
 * pays. Images (png/jpg/webp) are already compressed; compressing them again
 * wastes bytes and time, so they are skipped on purpose.
 */

import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib';
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const COMPRESSIBLE = new Set(['.css', '.js', '.svg', '.json', '.txt', '.html']);
const MAX_BYTES = 2_000_000; // skip absurd files; nothing here is close

let count = 0;
function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            walk(full);
            continue;
        }
        if (!COMPRESSIBLE.has(extOf(entry.name))) continue;
        const bytes = readFileSync(full);
        if (bytes.length === 0 || bytes.length > MAX_BYTES) continue;
        // Level 9 / quality 11: slowest, smallest - fine OFFLINE per build,
        // wrong choice at request time. That asymmetry is the whole trick.
        writeFileSync(`${full}.gz`, gzipSync(bytes, { level: 9 }));
        writeFileSync(
            `${full}.br`,
            brotliCompressSync(bytes, {
                params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 11 },
            })
        );
        count += 1;
    }
}

function extOf(name) {
    const dot = name.lastIndexOf('.');
    return dot === -1 ? '' : name.slice(dot).toLowerCase();
}

// Target dir defaults to the dev tree; production build passes dist/public
// so the compressed siblings live next to the files actually served.
const ROOT = process.argv[2] || 'public';
walk(ROOT);
console.log(`precompress: wrote .gz/.br siblings for ${count} assets`);
