/**
 * ADMIN ROUTES - pages + the four JSON mutation endpoints.
 * Every route here requires the main-admin session (fail-closed).
 */

import { Application } from "../core/01-application";
import { HttpError } from "../core/09-errors";
import { mainSessions } from "./guards";
import { render } from "../core/views";
import {
    getAllSubmissions,
    getSubmissionById,
    getDomainById,
    acceptSubmission,
    rejectSubmission,
    deleteSubmission,
    deleteDomain,
    updateSubmission,
    updateDomain,
} from "../server/queries/submissions";

const DOMAIN_FIELDS = [
    "R",
    "TP",
    "MT",
    "AR",
    "U",
    "MDL",
    "RA",
    "RoTech",
    "LS",
    "RoThink",
    "EoST",
    "EF",
    "RTE",
    "DLoI",
    "RaAoC",
] as const;

/** Strand labels for the edit form use THEIR OWN casing - baseline verbatim. */
const EDIT_STRANDS: ReadonlyArray<{ name: string; label: string }> = [
    { name: "R", label: "Relationship" },
    { name: "TP", label: "Teacher Planning" },
    { name: "MT", label: "Modify Their Teaching" },
    { name: "AR", label: "Achieve Readiness" },
    { name: "U", label: "Understanding" },
    { name: "MDL", label: "Multi-Dimensional Learning" },
    { name: "RA", label: "Reasoned Arguments" },
    { name: "RoTech", label: "Repertoire of Techniques" },
    { name: "LS", label: "Learning Spaces" },
    { name: "RoThink", label: "Reflect on Thinking" },
    { name: "EoST", label: "Evidence of Student Learning" },
    { name: "EF", label: "Employ Feedback" },
    { name: "RTE", label: "Risk Taking Environment" },
    { name: "DLoI", label: "Deepening Lines of Inquiry" },
    { name: "RaAoC", label: "Responsibility and Aspects of Citizenship" },
];

export function registerAdminRoutes(app: Application): void {
    app.get(
        "/admin",
        async (ctx) => {
            const subs = await getAllSubmissions();
            ctx.htmlRaw(render("admin", { subs }));
        },
        { guard: "mainAdmin" }
    );

    app.get(
        "/admin/edit/:id",
        async (ctx) => {
            const id = Number(ctx.params.id);
            if (!Number.isFinite(id)) ctx.throw(400, "Invalid id");
            const [sub, domain] = await Promise.all([getSubmissionById(id), getDomainById(id)]);
            if (sub === null) {
                ctx.throw(404, "Submission not found.");
                return; // unreachable - kept for null-flow narrowing
            }
            const flags = (domain ?? {}) as unknown as Record<string, boolean>;
            const strands = EDIT_STRANDS.map(({ name, label }) => ({
                name,
                label,
                checked: flags[name] === true,
            }));
            ctx.htmlRaw(render("admin-edit", { id, sub, strands }));
        },
        { guard: "mainAdmin" }
    );

    app.get(
        "/admin/export.csv",
        async (ctx) => {
            // Spreadsheet-friendly dump of every submission (accepted flag
            // included). Quoting per RFC 4180 so commas/quotes survive Excel.
            const subs = await getAllSubmissions();
            const esc = (v: unknown): string => {
                const s = String(v ?? "");
                return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
            };
            const head = "id,name,link,display,tl1,tl2,tl3,tl4,accepted";
            const rows = subs.map((s) =>
                [
                    s.id,
                    s.techname,
                    s.link,
                    s.displaytext,
                    s.tl1_desc,
                    s.tl2_desc,
                    s.tl3_desc,
                    s.tl4_desc,
                    s.accepted ? 1 : 0,
                ]
                    .map(esc)
                    .join(",")
            );
            ctx.res.writeHead(200, {
                "content-type": "text/csv; charset=utf-8",
                "content-disposition": 'attachment; filename="submissions.csv"',
            });
            ctx.res.end([head, ...rows].join("\r\n"));
        },
        { guard: "mainAdmin" }
    );

    app.post(
        "/api/admin/accept",
        async (ctx) => {
            const body = await ctx.body();
            // Bulk form: ids arrive as "1,2,3" from the checkbox batch; the
            // single-row JS path still sends one plain id.
            const raw = String((body as { id?: unknown }).id ?? "");
            const ids = raw.split(",").map(Number).filter(Number.isFinite);
            for (const id of ids) await acceptSubmission(id);
            ctx.json({ success: true });
        },
        { guard: "mainAdmin" }
    );

    app.post(
        "/api/admin/reject",
        async (ctx) => {
            const body = await ctx.body();
            const raw = String((body as { id?: unknown }).id ?? "");
            const ids = raw.split(",").map(Number).filter(Number.isFinite);
            for (const id of ids) await rejectSubmission(id);
            ctx.json({ success: true });
        },
        { guard: "mainAdmin" }
    );

    app.post(
        "/api/admin/delete",
        async (ctx) => {
            const body = await ctx.body();
            const id = Number((body as { id?: unknown }).id);
            await deleteDomain(id); // legacy deleted both rows together
            await deleteSubmission(id);
            ctx.json({ success: true });
        },
        { guard: "mainAdmin" }
    );

    app.post(
        "/api/admin/edit",
        async (ctx) => {
            const body = (await ctx.body()) as Record<string, unknown>;
            const id = Number(body.id1);
            if (!id) throw new HttpError(400, "Missing id");

            await updateSubmission(id, {
                techname: String(body.Techname ?? ""),
                link: String(body.Link ?? ""),
                displaytext: String(body.display ?? ""),
                tl1_desc: String(body.description ?? ""),
                tl2_desc: String(body.description2 ?? ""),
                tl3_desc: String(body.description3 ?? ""),
                tl4_desc: String(body.description4 ?? ""),
            });

            // Checkbox fields arrive as true/'on'/1 from the form encoder.
            const domainData: Record<string, boolean> = {};
            for (const field of DOMAIN_FIELDS) {
                const v = body[field];
                domainData[field] = v === true || v === "on" || v === 1 || v === "true";
            }
            await updateDomain(id, domainData);
            ctx.json({ success: true });
        },
        { guard: "mainAdmin" }
    );
}

// Re-exported so server.ts can build a login-aware logout link set later.
export { mainSessions };
