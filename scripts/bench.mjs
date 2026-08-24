#!/usr/bin/env node
/**
 * LOAD BENCHMARK - zero dependencies, pure node:http.
 *
 * Usage: BASE=http://localhost:3000 [DURATION=5] [CONCURRENCY=20] npm run bench
 *
 * Reports requests/second plus p50/p95/p99 latency against the RUNNING server.
 * Budgets (see src/core/01-application.ts PAGE_BUDGET_MS discussion):
 *   cached page  p95 < 20ms   uncached page p95 < 80ms   static asset < 5ms
 * Run it before AND after your change; performance work without numbers is
 * guesswork with extra steps.
 */

import { request } from "node:http";

const BASE = new URL(process.env.BASE ?? "http://localhost:3000");
const PATH = process.env.PATH ?? "/";
const DURATION_S = Number(process.env.DURATION ?? 5);
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 20);

const latencies = [];
let stopAt = Date.now() + DURATION_S * 1000;
let errors = 0;

function once() {
    return new Promise((resolveOne) => {
        const started = performance.now();
        const req = request(
            { hostname: BASE.hostname, port: BASE.port, path: PATH, method: "GET" },
            (res) => {
                res.resume();
                res.on("end", () => {
                    latencies.push(performance.now() - started);
                    resolveOne();
                });
            }
        );
        req.on("error", () => {
            errors += 1;
            resolveOne();
        });
        req.end();
    });
}

async function worker() {
    while (Date.now() < stopAt) await once();
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

latencies.sort((a, b) => a - b);
function pct(p) {
    if (!latencies.length) return NaN;
    return latencies[
        Math.min(latencies.length - 1, Math.floor((p / 100) * latencies.length))
    ].toFixed(1);
}
const seconds = DURATION_S;
console.log(`path=${PATH} concurrency=${CONCURRENCY} duration=${seconds}s`);
console.log(
    `requests=${latencies.length} errors=${errors} rps=${(latencies.length / seconds).toFixed(0)}`
);
console.log(`p50=${pct(50)}ms p95=${pct(95)}ms p99=${pct(99)}ms`);
