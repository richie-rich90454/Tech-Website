/**
 * WEB ADMIN VIEWS PART 3 - news, servers, giftcards, tickets, logs, hub,
 * settings. Same patterns as web-admin2; see that file for conventions.
 */
import { markup, type Html } from '../core/04-html';
import { dashShell } from './web-admin';
import type { PlanRow } from '../types/db';

function emptyRow(cols: number, msg: string): Html {
    return markup`<tr><td colSpan="${cols}" class="text-center text-muted">${msg}</td></tr>`;
}

function twoCol(title: string, crumb: Html, form: Html, list: Html): string {
    return dashShell(
        title,
        crumb,
        markup`<div class="container-fluid"><div class="row">${form}${list}</div></div>`
    );
}

export function newsAdminView(news: Array<{ ID: number; title: string; date: string }>): string {
    const rows =
        news.length > 0
            ? news.map(
                  (n) =>
                      markup`<tr><td>${n.ID}</td><td>${n.title}</td><td>${n.date}</td><td class="text-center"><button type="button" data-action="/web/api/admin/news" data-id="${n.ID}" class="btn btn-sm btn-danger">Delete</button></td></tr>`
              )
            : [emptyRow(4, 'No announcements yet.')];
    const form = markup`<div class="col-md-5"><div class="card"><div class="card-body"><h4 class="card-title">Create Announcement</h4><form class="mt-4" action="/web/api/admin/news" method="POST"><input type="hidden" name="action" value="create"/><div class="form-group"><label class="text-white">Title</label><input class="form-control" required name="title"/></div><div class="form-group"><label class="text-white">Content</label><textarea class="form-control" name="content" rows="4" required></textarea></div><button type="submit" class="btn btn-success">Publish</button></form></div></div></div>`;
    const list = markup`<div class="col-md-7"><div class="card"><div class="card-body"><h4 class="card-title">All Announcements</h4><div class="table-responsive mt-4"><table class="table"><thead><tr><th>ID</th><th>Title</th><th>Date</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div>`;
    return twoCol('News Management', markup`News`, form, list);
}

export function serversAdminView(
    servers: Array<{ id: number; name: string; ip: string; slots: number; methods: string }>
): string {
    const rows =
        servers.length > 0
            ? servers.map(
                  (s) =>
                      markup`<tr><td>${s.id}</td><td>${s.name}</td><td>${s.ip}</td><td>${s.slots}</td><td>${s.methods}</td><td class="text-center"><button type="button" data-action="/web/api/admin/servers" data-id="${s.id}" class="btn btn-sm btn-danger">Delete</button></td></tr>`
              )
            : [emptyRow(6, 'No servers added yet.')];
    const form = markup`<div class="col-md-5"><div class="card"><div class="card-body"><h4 class="card-title">Add Server</h4><form class="mt-4" action="/web/api/admin/servers" method="POST"><input type="hidden" name="action" value="create"/><div class="form-group"><label class="text-white">Name</label><input class="form-control" required name="name"/></div><div class="form-group"><label class="text-white">IP Address</label><input class="form-control" required name="ip"/></div><div class="form-group"><label class="text-white">Password</label><input class="form-control" type="password" required name="password"/></div><div class="form-group"><label class="text-white">Slots</label><input class="form-control" type="number" required name="slots" value="10"/></div><div class="form-group"><label class="text-white">Methods</label><input class="form-control" name="methods" value="UDP,TCP"/></div><button type="submit" class="btn btn-success">Add Server</button></form></div></div></div>`;
    const list = markup`<div class="col-md-7"><div class="card"><div class="card-body"><h4 class="card-title">All Servers</h4><div class="table-responsive mt-4"><table class="table"><thead><tr><th>ID</th><th>Name</th><th>IP</th><th>Slots</th><th>Methods</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div>`;
    return twoCol('API Server Management', markup`API Servers`, form, list);
}

export function giftcardsAdminView(cards: unknown[], plans: PlanRow[]): string {
    const planOpts = plans.map((pl) => markup`<option value="${pl.ID}">${pl.name}</option>`);
    const rows =
        (
            cards as Array<{
                ID: number;
                code: string;
                planID: number;
                claimedby: number;
                date: number;
            }>
        ).length > 0
            ? (
                  cards as Array<{
                      ID: number;
                      code: string;
                      planID: number;
                      claimedby: number;
                      date: number;
                  }>
              ).map(
                  (c) =>
                      markup`<tr><td>${c.ID}</td><td>${c.code}</td><td>${c.planID}</td><td>${
                          c.claimedby || '-'
                      }</td><td>${new Date(c.date * 1000).toLocaleDateString('en-US')}</td></tr>`
              )
            : [emptyRow(5, 'No gift cards yet.')];
    const form = markup`<div class="col-md-4"><div class="card"><div class="card-body"><h4 class="card-title">Generate Codes</h4><form class="mt-4" action="/web/api/admin/giftcards" method="POST"><input type="hidden" name="action" value="generate"/><div class="form-group"><label class="text-white">Plan</label><select class="form-control" name="planID" required><option value="">Select a plan...</option>${planOpts}</select></div><div class="form-group"><label class="text-white">Number of codes</label><input class="form-control" type="number" min="1" max="100" required name="count" value="1"/></div><button type="submit" class="btn btn-success">Generate</button></form></div></div></div>`;
    const list = markup`<div class="col-md-8"><div class="card"><div class="card-body"><h4 class="card-title">All Gift Cards</h4><div class="table-responsive mt-4"><table class="table"><thead><tr><th>ID</th><th>Code</th><th>Plan</th><th>Claimed By</th><th>Created</th><th>Claimed</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div>`;
    return twoCol('Gift Cards', markup`Gift Cards`, form, list);
}
