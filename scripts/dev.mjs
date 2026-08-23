#!/usr/bin/env node
/**
 * DEVELOPMENT RUNNER - one command, two watchers.
 *
 * PURPOSE
 * `npm run dev` starts BOTH halves of the stack and restarts on change:
 *   1. tsx watch server.ts   -> the Node server (TypeScript executed directly)
 *   2. esbuild --watch       -> public/ts/*.ts compiled to ES5 in public/js/
 *
 * WHY A SCRIPT INSTEAD OF CONCURRENTLY/NODEMON?
 * Two extra dev-only dependencies to do what node's child_process already does.
 * This file IS the documentation: spawn two children, pipe their output here,
 * forward Ctrl+C to both. Nothing else. (Zero-dependency policy applies to dev
 * tooling too wherever the stdlib suffices.)
 */

import { spawn } from 'node:child_process';

const children = [];

function run(name, command, args, color) {
    const child = spawn(command, args, { shell: process.platform === 'win32', stdio: 'pipe' });
    const tag = `\x1b[${color}m[${name}]\x1b[0m`;
    const relay = (stream, out) =>
        stream.on('data', (chunk) =>
            chunk
                .toString()
                .split('\n')
                .filter(Boolean)
                .forEach((line) => out(`${tag} ${line}`))
        );
    relay(child.stdout, console.log);
    relay(child.stderr, console.error);
    children.push(child);
    return child;
}

console.log('dev: starting server watcher + client bundler watcher...');
run('server', 'npx', ['tsx', 'watch', 'server.ts'], '36');
run(
    'client',
    'npx',
    [
        'esbuild',
        'public/ts/menu.ts',
        'public/ts/tabs.ts',
        'public/ts/img-fallback.ts',
        'public/ts/scroll-top.ts',
        'public/ts/wheel.ts',
        '--outdir=public/js',
        '--target=ie11',
        '--watch',
    ],
    '33'
);

function shutdown() {
    for (const child of children) child.kill();
    process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
