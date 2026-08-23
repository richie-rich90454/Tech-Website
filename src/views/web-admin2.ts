/**
 * WEB ADMIN VIEWS PART 2 - remaining CRUD pages.
 * Split from web-admin.ts purely for file size; same patterns, same shell.
 */
import { markup, type Html } from '../core/04-html';
import { dashShell } from './web-admin';
import type { PlanRow } from '../types/db';

const YEN = '\u00a5';

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

export function plansAdminView(plans: PlanRow[]): string {
    const rows =
        plans.length > 0
            ? plans.map(
                  (pl) =>
                      markup`<tr><td>${pl.ID}</td><td>${pl.name}</td><td>${pl.price}${YEN}</td><td>${pl.length}d</td><td class="text-center"><button type="button" data-action="/web/api/admin/plans" data-id="${pl.ID}" class="btn btn-sm btn-danger">Delete</button></td></tr>`
              )
            : [emptyRow(5, 'No plans created yet.')];
    const form = markup`<div class="col-md-5"><div class="card"><div class="card-body"><h4 class="card-title">Create Plan</h4><form class="mt-4" action="/web/api/admin/plans" method="POST"><input type="hidden" name="action" value="create"/><div class="form-group"><label class="text-white">Name</label><input class="form-control" placeholder="Gold" required name="name"/></div><div class="form-group"><label class="text-white">Price (${YEN})</label><input class="form-control" type="number" step="0.01" required name="price"/></div><div class="form-group"><label class="text-white">Duration (days)</label><input class="form-control" type="number" required name="length"/></div><div class="form-group"><label class="text-white">Max Attack Time (s)</label><input class="form-control" type="number" required name="mbt"/></div><div class="form-group"><label class="text-white">Concurrents</label><input class="form-control" type="number" required name="concurrents"/></div><div class="form-group"><label class="text-white">VIP</label><select class="form-control" name="vip"><option value="0">No</option><option value="1">Yes</option></select></div><button type="submit" class="btn btn-success">Create Plan</button></form></div></div></div>`;
    const list = markup`<div class="col-md-7"><div class="card"><div class="card-body"><h4 class="card-title">All Plans</h4><div class="table-responsive mt-4"><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Length</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div>`;
    return twoCol('Plan Management', markup`Plans`, form, list);
}

export function methodsAdminView(
    methods: Array<{ id: number; name: string; fullname: string; type: string; command: string }>
): string {
    const rows =
        methods.length > 0
            ? methods.map(
                  (m) =>
                      markup`<tr><td>${m.id}</td><td>${m.name}</td><td>${m.fullname}</td><td>${m.type}</td><td>${m.command}</td><td class="text-center"><button type="button" data-action="/web/api/admin/methods" data-id="${m.id}" class="btn btn-sm btn-danger">Delete</button></td></tr>`
              )
            : [emptyRow(6, 'No methods added yet.')];
    const form = markup`<div class="col-md-5"><div class="card"><div class="card-body"><h4 class="card-title">Add Method</h4><form class="mt-4" action="/web/api/admin/methods" method="POST"><input type="hidden" name="action" value="create"/><div class="form-group"><label class="text-white">Name</label><input class="form-control" placeholder="UDP" required name="name"/></div><div class="form-group"><label class="text-white">Full Name</label><input class="form-control" placeholder="UDP Flood" required name="fullname"/></div><div class="form-group"><label class="text-white">Type</label><select class="form-control" name="type" required><option value="layer4">Layer 4</option><option value="layer7">Layer 7</option></select></div><div class="form-group"><label class="text-white">Command</label><input class="form-control" placeholder="./udp {host} {port} {time}" required name="command"/></div><button type="submit" class="btn btn-success">Add Method</button></form></div></div></div>`;
    const list = markup`<div class="col-md-7"><div class="card"><div class="card-body"><h4 class="card-title">All Methods</h4><div class="table-responsive mt-4"><table class="table"><thead><tr><th>ID</th><th>Name</th><th>Full Name</th><th>Type</th><th>Command</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></div></div></div>`;
    return twoCol('Method Management', markup`Methods`, form, list);
}
