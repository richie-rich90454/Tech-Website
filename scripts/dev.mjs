#!/usr/bin/env node
/**
 * DEVELOPMENT RUNNER - one command, two watchers.
 *
 * PURPOSE
 * `npm run dev` starts BOTH halves of the stack and restarts on change:
 *   1. tsx watch server.ts   -> the Node server (TypeScript executed directly)
 *   2. tsc -p public/ts --watch -> public/ts/*.ts compiled to ES5 in public/js/
 *
 * WHY A SCRIPT INSTEAD OF CONCURRENTLY/NODEMON?
 * Two extra dev-only dependencies to do what node's child_process already does.
 * This file IS the documentation: spawn two children, pipe their output here,
 * forward Ctrl+C to both. Nothing else.
 */

import { spawn } from 'node:child_process';

const children = [];

function run(name, singleCommand, color) {
    // Windows requires shell for .cmd files; Node 24 warns when args are
    // separate (DEP0190). Passing a single pre-built string is safe here
    // because no user input flows into these commands.
    const child = spawn(singleCommand, { shell: true, stdio: 'pipe' });
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

console.log('dev: starting server watcher + client compiler watcher...');
run('server', 'npx tsx watch server.ts', '36');
// tsc --watch recompiles public/ts -> public/js (ES5) on every save using
// the same config as production builds - one compiler everywhere.
run('client', 'npx tsc -p public/ts --watch --preserveWatchOutput', '33');

function shutdown() {
    for (const child of children) child.kill();
    process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
