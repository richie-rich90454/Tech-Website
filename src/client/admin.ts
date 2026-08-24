/**
 * ADMIN PANEL CLIENT - binds the table's plain buttons to the JSON API.
 * No inline handlers anywhere: every control carries data-* attributes and
 * this file does the wiring, exactly like the legacy React handlers did.
 *
 * Bulk mode: each row gets a checkbox; "Accept selected"/"Reject selected"
 * post one comma-joined id list to the same endpoints the single buttons use.
 */
(function () {
    'use strict';

    /**
     * POST JSON via XHR - fetch() does not exist in IE11, and this panel is
     * the one place that needs HTTP calls from the client.
     */
    function post(url: string, idList: string): void {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function (): void {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                reload();
            } else {
                fail(new Error('HTTP ' + xhr.status));
            }
        };
        xhr.onerror = function (): void {
            fail(new Error('Network error'));
        };
        xhr.send(JSON.stringify({ id: idList }));
    }

    function reload(): void {
        window.location.reload();
    }

    function fail(err: Error): void {
        alert('Action failed: ' + (err && err.message ? err.message : String(err)));
    }

    function ready(): void {
        var table = document.querySelector<HTMLTableElement>('.AdminTable_table__3iS2Y');
        if (!table) return;

        // ---- single-row actions ------------------------------------------
        table.addEventListener('click', function (ev: Event) {
            var target = ev.target as HTMLElement | null;
            if (!target || target.nodeType !== 1) return;

            var editId = target.getAttribute('data-edit');
            if (editId) {
                window.location.href = '/admin/edit/' + encodeURIComponent(editId);
                return;
            }

            var action = target.getAttribute('data-action');
            var id = target.getAttribute('data-id');
            if (!action || !id) return;
            ev.preventDefault();

            if (action === '/api/admin/delete') {
                if (!window.confirm('Delete submission #' + id + ' permanently?')) return;
            }
            post(action, id);
        });

        // ---- bulk selection column ---------------------------------------
        var headRow = table.tHead && table.tHead.rows[0];
        var body = table.tBodies[0];
        if (!headRow || !body || body.rows.length === 0) return;
        // Skip when the checkbox column is already present.
        if (headRow.cells[0].getAttribute('data-bulk') === 'on') return;

        var th = document.createElement('th');
        th.setAttribute('data-bulk', 'on');
        var all = document.createElement('input');
        all.type = 'checkbox';
        all.setAttribute('aria-label', 'Select all rows');
        th.appendChild(all);
        headRow.insertBefore(th, headRow.cells[0]);

        Array.prototype.forEach.call(body.rows, function (row: HTMLTableRowElement) {
            var td = document.createElement('td');
            var box = document.createElement('input');
            box.type = 'checkbox';
            box.className = 'bulk-row';
            td.appendChild(box);
            row.insertBefore(td, row.cells[0]);
        });

        all.addEventListener('change', function () {
            Array.prototype.forEach.call(
                document.querySelectorAll<HTMLInputElement>('.bulk-row'),
                function (box: HTMLInputElement) {
                    box.checked = all.checked;
                }
            );
        });

        // ---- bulk action bar ---------------------------------------------
        var nav = document.getElementById('adminNav');
        if (!nav || !nav.parentElement) return;
        var host = nav.parentElement;

        var bar = document.createElement('div');
        bar.style.margin = '12px 0';

        var mkButton = function (label: string): HTMLButtonElement {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = label;
            b.style.marginRight = '8px';
            return b;
        };

        var acceptBtn = mkButton('Accept selected');
        var rejectBtn = mkButton('Reject selected');

        acceptBtn.addEventListener('click', function () {
            var ids = selectedIds();
            if (!ids) {
                alert('Select at least one row first.');
                return;
            }
            post('/api/admin/accept', ids);
        });
        rejectBtn.addEventListener('click', function () {
            var ids = selectedIds();
            if (!ids) {
                alert('Select at least one row first.');
                return;
            }
            post('/api/admin/reject', ids);
        });

        bar.appendChild(acceptBtn);
        bar.appendChild(rejectBtn);

        var csv = document.createElement('a');
        csv.href = '/admin/export.csv';
        csv.textContent = 'Export CSV';
        csv.style.marginLeft = '8px';
        bar.appendChild(csv);

        host.insertBefore(bar, nav.nextSibling);

        function selectedIds(): string {
            var picked: number[] = [];
            Array.prototype.forEach.call(
                document.querySelectorAll<HTMLInputElement>('.bulk-row'),
                function (box: HTMLInputElement, i: number) {
                    if (box.checked) picked.push(i);
                }
            );
            return picked
                .map(function (i) {
                    var row = body.rows[i];
                    // After the checkbox column insert: 0=box, 1=the id cell.
                    var cell = row && row.cells[1];
                    return cell ? cell.textContent!.trim() : '';
                })
                .filter(function (idText) {
                    return idText !== '';
                })
                .join(',');
        }
    }

    if (document.readyState !== 'loading') ready();
    else document.addEventListener('DOMContentLoaded', ready);
})();
