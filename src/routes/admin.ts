/**
 * ADMIN ROUTES - pages + the four JSON mutation endpoints.
 * Every route here requires the main-admin session (fail-closed).
 */

import { Application } from '../core/01-application';
import { HttpError } from '../core/09-errors';
import { mainSessions } from './guards';
import { adminView, adminEditView } from '../views/admin';
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
} from '../server/queries/submissions';

const DOMAIN_FIELDS = [
    'R',
    'TP',
    'MT',
    'AR',
    'U',
    'MDL',
    'RA',
    'RoTech',
    'LS',
    'RoThink',
    'EoST',
    'EF',
    'RTE',
    'DLoI',
    'RaAoC',
] as const;

export function registerAdminRoutes(app: Application): void {
    app.get(
        '/admin',
        async (ctx) => {
            const subs = await getAllSubmissions();
            ctx.htmlRaw(adminView(subs));
        },
        { guard: 'mainAdmin' }
    );

    app.get(
        '/admin/edit/:id',
        async (ctx) => {
            const id = Number(ctx.params.id);
            if (!Number.isFinite(id)) ctx.throw(400, 'Invalid id');
            const [sub, domain] = await Promise.all([getSubmissionById(id), getDomainById(id)]);
            if (sub === null) {
                ctx.throw(404, 'Submission not found.');
                return; // unreachable - kept for null-flow narrowing
            }
            ctx.htmlRaw(adminEditView(id, sub, domain));
        },
        { guard: 'mainAdmin' }
    );

    app.post(
        '/api/admin/accept',
        async (ctx) => {
            const body = await ctx.body();
            await acceptSubmission(Number((body as { id?: unknown }).id));
            ctx.json({ success: true });
        },
        { guard: 'mainAdmin' }
    );

    app.post(
        '/api/admin/reject',
        async (ctx) => {
            const body = await ctx.body();
            await rejectSubmission(Number((body as { id?: unknown }).id));
            ctx.json({ success: true });
        },
        { guard: 'mainAdmin' }
    );

    app.post(
        '/api/admin/delete',
        async (ctx) => {
            const body = await ctx.body();
            const id = Number((body as { id?: unknown }).id);
            await deleteDomain(id); // legacy deleted both rows together
            await deleteSubmission(id);
            ctx.json({ success: true });
        },
        { guard: 'mainAdmin' }
    );

    app.post(
        '/api/admin/edit',
        async (ctx) => {
            const body = (await ctx.body()) as Record<string, unknown>;
            const id = Number(body.id1);
            if (!id) throw new HttpError(400, 'Missing id');

            await updateSubmission(id, {
                techname: String(body.Techname ?? ''),
                link: String(body.Link ?? ''),
                displaytext: String(body.display ?? ''),
                tl1_desc: String(body.description ?? ''),
                tl2_desc: String(body.description2 ?? ''),
                tl3_desc: String(body.description3 ?? ''),
                tl4_desc: String(body.description4 ?? ''),
            });

            // Checkbox fields arrive as true/'on'/1 from the form encoder.
            const domainData: Record<string, boolean> = {};
            for (const field of DOMAIN_FIELDS) {
                const v = body[field];
                domainData[field] = v === true || v === 'on' || v === 1 || v === 'true';
            }
            await updateDomain(id, domainData);
            ctx.json({ success: true });
        },
        { guard: 'mainAdmin' }
    );
}

// Re-exported so server.ts can build a login-aware logout link set later.
export { mainSessions };
