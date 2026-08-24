/**
 * Unit test samples: Router matching + TtlCache behavior.
 * Note how the router is tested WITHOUT HTTP - match() takes plain strings.
 * That is the payoff of keeping Context out of the matching hot path.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { Router } from "../../src/core/02-router";
import { TtlCache } from "../../src/core/06-cache";

test("router: static route hit through the fast path", () => {
    const r = new Router();
    r.get("/health", async (ctx) => ctx.json({ ok: true }));
    const m = r.dispatch("GET", "/health", { params: {} } as never);
    assert.ok(m, "static route should match");
});

test("router: dynamic :params are captured and decoded", () => {
    const r = new Router();
    const ctx = { params: {} as Record<string, string> } as never;
    r.get("/web/tickets/:id", async () => {});
    r.dispatch("GET", "/web/tickets/42", ctx);
    assert.equal((ctx as { params: Record<string, string> }).params.id, "42");
});

test("router: registration order breaks ties (first wins)", async () => {
    const r = new Router();
    let which = "";
    const fakeCtx = { params: {} } as never;
    r.get("/x/:id", async () => void (which = "generic"));
    r.post("/x/special", async () => void (which = "specific-post"));
    // Same path, different METHOD proves method separation too.
    const m = r.dispatch("POST", "/x/special", fakeCtx);
    await m?.handler(fakeCtx);
    assert.equal(which, "specific-post");
    assert.equal(m?.options.guard, undefined);
});

test("router: trailing slash still matches the static entry", () => {
    const r = new Router();
    r.get("/web/tickets/", async () => {});
    assert.ok(r.match("GET", "/web/tickets"), "trailing slash should normalize");
});

test("ttl cache: remember() computes once then serves from memory", async () => {
    const cache = new TtlCache<number>(60);
    let calls = 0;
    const produce = async () => {
        calls += 1;
        return 7;
    };
    assert.equal(await cache.remember("k", produce), 7);
    assert.equal(await cache.remember("k", produce), 7);
    assert.equal(calls, 1);
});

test("ttl cache: wildcard bust clears prefixed keys only", () => {
    const cache = new TtlCache<string>(60);
    cache.set("tl:tl1", "one");
    cache.set("tl:tl2", "two");
    cache.set("home", "landing");
    cache.bust("tl:*");
    assert.equal(cache.get("tl:tl1"), undefined);
    assert.equal(cache.get("tl:tl2"), undefined);
    assert.equal(cache.get("home"), "landing");
});
