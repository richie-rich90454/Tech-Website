/**
 * ============================================================================
 * ADMIN VIEWS - /admin (submissions table) and /admin/edit/:id
 * ============================================================================
 *
 * CSS-MODULES PARITY NOTE
 * The table's class names are content-hashed CSS-Module outputs from the old
 * build (e.g. AdminTable_wrap__1AlVX). We ship that compiled stylesheet
 * VERBATIM as public/css/admintable.css and reuse the exact same names here -
 * zero visual drift, no build step to regenerate hashes.
 *
 * ACTION BUTTONS are intentionally plain <button type="button"> with no inline
 * handlers: public/js/admin.js binds them to the JSON API at runtime, exactly
 * like the legacy React handlers did.
 */

import { markup, esc, unsafe, type Html } from '../core/04-html';
import { shell } from './shell';
import type { SubmissionRow, DomainRow } from '../types/db';

/** Hashed CSS-module names frozen from the previous build - DO NOT reword. */
const C = {
    wrap: 'AdminTable_wrap__1AlVX',
    table: 'AdminTable_table__3iS2Y',
    mono: 'AdminTable_mono__EqBH0',
    name: 'AdminTable_name__ZKSIb',
    link: 'AdminTable_link__lOs5j',
    desc: 'AdminTable_desc__CgL_8',
    badgeOk: 'AdminTable_badgeOk__o19q_',
    badgePending: 'AdminTable_badgePending__XpYWw',
    actions: 'AdminTable_actions__k8lIU',
    btnAccept: 'AdminTable_btnAccept__MJt7Z',
    btnReject: 'AdminTable_btnReject__w9wZ7',
    btnEdit: 'AdminTable_btnEdit__zHqfB',
    btnDelete: 'AdminTable_btnDelete__KFKXJ',
} as const;

function topbar(title: Html): Html {
    return markup`<div id="adminTopbar"><h1 id="admin-heading">${title}</h1></div>`;
}

export function adminView(subs: SubmissionRow[]): string {
    const rows = subs.map((sub) => {
        const statusBadge = sub.accepted
            ? markup`<span class="${C.badgeOk}">Accepted</span>`
            : markup`<span class="${C.badgePending}">Pending</span>`;
        const acceptOrReject = sub.accepted
            ? markup`<button type="button" data-action="/api/admin/reject" data-id="${sub.id}" class="${C.btnReject}">Reject</button>`
            : markup`<button type="button" data-action="/api/admin/accept" data-id="${sub.id}" class="${C.btnAccept}">Accept</button>`;
        const desc = (text: string) => esc(text.slice(0, 90));
        return markup`<tr><td class="${C.mono}">${sub.id}</td><td class="${C.name}">${sub.techname}</td><td><a href="${sub.link}" target="_blank" rel="noreferrer" class="${C.link}">${sub.link}</a></td><td>${sub.displaytext}</td><td class="${C.desc}">${desc(
            sub.tl1_desc
        )}</td><td class="${C.desc}">${desc(sub.tl2_desc)}</td><td class="${C.desc}">${desc(
            sub.tl3_desc
        )}</td><td class="${C.desc}">${desc(
            sub.tl4_desc
        )}</td><td>${statusBadge}</td><td class="${C.actions}">${acceptOrReject}<button type="button" data-edit="${sub.id}" class="${C.btnEdit}">Edit</button><button type="button" data-action="/api/admin/delete" data-id="${sub.id}" class="${C.btnDelete}">Delete</button></td></tr>`;
    });
    const body = markup`<div id="adminTopbar"><h1 id="admin-heading">Admin Panel</h1></div><div id="adminNav"><ul><li><b>Admin Panel</b></li><li><a href="/admin#submissions">All Submissions</a></li><li><a href="/api/import">Import Excel Data</a></li><li><a href="/api/auth/logout">Logout</a></li></ul></div><section id="submissions" style="scroll-margin-top:var(--nav-offset)"><div class="${unsafe(
        C.wrap
    )}"><table class="${unsafe(C.table)}"><thead><tr><th>ID</th><th>Name</th><th>Link</th><th>Display</th><th>TL1</th><th>TL2</th><th>TL3</th><th>TL4</th><th>Status</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
    return shell({
        title: 'Admin Panel · BIBS·C Tech Tools',
        body,
        css: ['admintable.css'],
        scripts: ['admin.js'],
    });
}

/** Strand labels for the edit form use THEIR OWN casing - baseline verbatim. */
const EDIT_STRANDS: Array<{ name: string; label: string }> = [
    { name: 'R', label: 'Relationship' },
    { name: 'TP', label: 'Teacher Planning' },
    { name: 'MT', label: 'Modify Their Teaching' },
    { name: 'AR', label: 'Achieve Readiness' },
    { name: 'U', label: 'Understanding' },
    { name: 'MDL', label: 'Multi-Dimensional Learning' },
    { name: 'RA', label: 'Reasoned Arguments' },
    { name: 'RoTech', label: 'Repertoire of Techniques' },
    { name: 'LS', label: 'Learning Spaces' },
    { name: 'RoThink', label: 'Reflect on Thinking' },
    { name: 'EoST', label: 'Evidence of Student Learning' },
    { name: 'EF', label: 'Employ Feedback' },
    { name: 'RTE', label: 'Risk Taking Environment' },
    { name: 'DLoI', label: 'Deepening Lines of Inquiry' },
    { name: 'RaAoC', label: 'Responsibility and Aspects of Citizenship' },
];

export function adminEditView(id: number, sub: SubmissionRow, domain: DomainRow | null): string {
    const ta = (name: string, value: string): Html =>
        markup`<textarea name="${name}">${value}</textarea>`;
    const strands = EDIT_STRANDS.map(
        ({ name, label }) =>
            markup`<li><input type="checkbox" name="${name}"${
                domain && (domain as unknown as Record<string, boolean>)[name]
                    ? unsafe(' checked=""')
                    : ''
            }/><span>${label}</span></li>`
    );
    const body = markup`${topbar(markup`Edit Submission #${id}`)}<div id="adminNav"><ul><li><a href="/admin">&#8592; Back to Admin</a></li></ul></div><form method="post" action="/api/admin/edit"><table><thead><tr><th>Tool ID</th><th>Tool Name</th><th>TL1 Description</th><th>TL2 Description</th><th>TL3 Description</th><th>TL4 Description</th><th>Link</th><th>Display Text</th></tr></thead><tbody><tr><td>${id}</td>${ta(
        'Techname',
        sub.techname
    )}${ta('description', sub.tl1_desc)}${ta('description2', sub.tl2_desc)}${ta(
        'description3',
        sub.tl3_desc
    )}${ta('description4', sub.tl4_desc)}${ta('Link', sub.link)}${ta(
        'display',
        sub.displaytext
    )}</td></tr></tbody></table><input type="hidden" name="id1" value="${id}"/><h3>Strands</h3><ul>${strands}</ul><button type="submit">Submit</button></form>`;
    return shell({ title: `Edit Submission #${id} · BIBS·C Tech Tools`, body });
}
