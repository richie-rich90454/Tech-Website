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

    function post(url, idList) {
        // fetch() exists in all target browsers for admin use (internal tool).
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: idList }),
        }).then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        });
    }

    function reload() {
        window.location.reload();
    }

    function fail(err) {
        alert('Action failed: ' + (err && err.message ? err.message : err));
    }

    function ready() {
        var table = document.querySelector('.AdminTable_table__3iS2Y');
        if (!table) return;

        // ---- single-row actions ------------------------------------------
        table.addEventListener('click', function (ev) {
            var el = ev.target;
            if (!el || el.nodeType !== 1) return;

            var editId = el.getAttribute('data-edit');
            if (editId) {
                window.location.href = '/admin/edit/' + encodeURIComponent(editId);
                return;
            }

            var action = el.getAttribute('data-action');
            var id = el.getAttribute('data-id');
            if (!action || !id) return;
            ev.preventDefault();

            if (action === '/api/admin/delete') {
                if (!window.confirm('Delete submission #' + id + ' permanently?')) return;
                post(action, id).then(reload, fail);
            } else {
                post(action, id).then(reload, fail);
            }
        });

        // ---- bulk selection column ---------------------------------------
        var headRow = table.tHead && table.tHead.rows[0];
        var firstBodyRow = table.tBodies[0] && table.tBodies[0].rows[0];
        if (!headRow || !firstBodyRow) return;
        // Skip when the checkbox column is already present.
        if (headRow.cells[0].getAttribute('data-bulk') === 'on') return;

        var th = document.createElement('th');
        th.setAttribute('data-bulk', 'on');
        var all = document.createElement('input');
        all.type = 'checkbox';
        all.setAttribute('aria-label', 'Select all rows');
        th.appendChild(all);
        headRow.insertBefore(th, headRow.cells[0]);

        Array.prototype.forEach.call(table.tBodies[0].rows, function (row) {
            var td = document.createElement('td');
            var box = document.createElement('input');
            box.type = 'checkbox';
            box.className = 'bulk-row';
            td.appendChild(box);
            row.insertBefore(td, row.cells[0]);
        });

        all.addEventListener('change', function () {
            Array.prototype.forEach.call(
                document.querySelectorAll('.bulk-row'),
                function (box) {
                    box.checked = all.checked;
                }
            );
        });

        // ---- bulk action bar ---------------------------------------------
        var nav = document.getElementById('adminNav');
        if (nav && nav.parentElement) {
            var bar = document.createElement('div');
            bar.style.margin = '12px 0';

            function mkButton(label) {
                var b = document.createElement('button');
                b.type = 'button';
                b.textContent = label;
                b.style.marginRight = '8px';
                return b;
            }
            var acceptBtn = mkButton('Accept selected');
            var rejectBtn = mkButton('Reject selected');

            acceptBtn.addEventListener('click', function () {
                var ids = selectedIds();
                if (!ids) {
                    alert('Select at least one row first.');
                    return;
                }
                post('/api/admin/accept', ids).then(reload, fail);
            });
            rejectBtn.addEventListener('click', function () {
                var ids = selectedIds();
                if (!ids) {
                    alert('Select at least one row first.');
                    return;
                }
                post('/api/admin/reject', ids).then(reload, fail);
            });

            bar.appendChild(acceptBtn);
            bar.appendChild(rejectBtn);

            var csv = document.createElement('a');
            csv.href = '/admin/export.csv';
            csv.textContent = 'Export CSV';
            csv.style.marginLeft = '8px';
            bar.appendChild(csv);

            nav.parentElement.insertBefore(bar, nav.nextSibling);
        }

        function selectedIds() {
            return Array.prototype.map
                .call(document.querySelectorAll('.bulk-row'), function (box, i) {
                    return box.checked ? i : null;
                })
                .filter(function (v) {
                    return v !== null;
                })
                .map(function (i) {
                    return table.tBodies[0].rows[i].cells[1].textContent.trim();
                })
                .join(',');
        }
    }

    if (document.readyState !== 'loading') ready();
    else document.addEventListener('DOMContentLoaded', ready);
})();
