/**
 * ADMIN PANEL CLIENT - binds the table's plain buttons to the JSON API.
 * No inline handlers anywhere: every control carries data-* attributes and
 * this file does the wiring, exactly like the legacy React handlers did.
 *
 * Bulk mode: each row gets a checkbox; "Accept selected"/"Reject selected"
 * post one comma-joined id list to the same endpoints the single buttons use.
 */

function initAdminPanel(): void {
    const table = document.querySelector<HTMLTableElement>(".AdminTable_table__3iS2Y");
    if (!table) return;

    // ---- XHR transport (fetch does not exist in IE11) --------------------
    function post(url: string, idList: string): void {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status >= 200 && xhr.status < 300) {
                window.location.reload();
            } else {
                alert("Action failed: HTTP " + xhr.status);
            }
        };
        xhr.onerror = function () {
            alert("Action failed: network error");
        };
        xhr.send(JSON.stringify({ id: idList }));
    }

    function selectedIds(): string {
        const picked: number[] = [];
        Array.prototype.forEach.call(
            document.querySelectorAll<HTMLInputElement>(".bulk-row"),
            function (box: HTMLInputElement, i: number) {
                if (box.checked) picked.push(i);
            }
        );
        return picked
            .map(function (i) {
                const row = table!.rows[i];
                // After the checkbox column insert: 0=box, 1=the id cell.
                const cell = row && row.cells[1];
                return cell ? (cell.textContent || "").trim() : "";
            })
            .filter(function (idText) {
                return idText !== "";
            })
            .join(",");
    }

    // ---- single-row actions ----------------------------------------------
    table.addEventListener("click", function (ev: Event) {
        const target = ev.target as HTMLElement | null;
        if (!target || target.nodeType !== 1) return;

        const editId = target.getAttribute("data-edit");
        if (editId) {
            window.location.href = "/admin/edit/" + encodeURIComponent(editId);
            return;
        }

        const action = target.getAttribute("data-action");
        const id = target.getAttribute("data-id");
        if (!action || !id) return;
        ev.preventDefault();

        if (action === "/api/admin/delete") {
            if (!window.confirm("Delete submission #" + id + " permanently?")) return;
        }
        post(action, id);
    });

    // ---- bulk selection column -------------------------------------------
    const headRow = table.tHead && table.tHead.rows[0];
    const body = table.tBodies[0];
    if (!headRow || !body || body.rows.length === 0) return;
    // Skip when the checkbox column is already present.
    if (headRow.cells[0].getAttribute("data-bulk") === "on") return;

    const th = document.createElement("th");
    th.setAttribute("data-bulk", "on");
    const selectAll = document.createElement("input");
    selectAll.type = "checkbox";
    selectAll.setAttribute("aria-label", "Select all rows");
    th.appendChild(selectAll);
    headRow.insertBefore(th, headRow.cells[0]);

    Array.prototype.forEach.call(body.rows, function (row: HTMLTableRowElement) {
        const td = document.createElement("td");
        const box = document.createElement("input");
        box.type = "checkbox";
        box.className = "bulk-row";
        td.appendChild(box);
        row.insertBefore(td, row.cells[0]);
    });

    selectAll.addEventListener("change", function () {
        Array.prototype.forEach.call(
            document.querySelectorAll<HTMLInputElement>(".bulk-row"),
            function (box: HTMLInputElement) {
                box.checked = selectAll.checked;
            }
        );
    });

    // ---- bulk action bar ---------------------------------------------------
    const nav = document.getElementById("adminNav");
    if (!nav || !nav.parentElement) return;

    const bar = document.createElement("div");
    bar.style.margin = "12px 0";

    function bulkButton(label: string): HTMLButtonElement {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.style.marginRight = "8px";
        b.addEventListener("click", function () {
            const ids = selectedIds();
            if (!ids) {
                alert("Select at least one row first.");
                return;
            }
            post(b.getAttribute("data-endpoint") || "", ids);
        });
        return b;
    }

    const acceptBtn = bulkButton("Accept selected");
    acceptBtn.setAttribute("data-endpoint", "/api/admin/accept");
    const rejectBtn = bulkButton("Reject selected");
    rejectBtn.setAttribute("data-endpoint", "/api/admin/reject");

    bar.appendChild(acceptBtn);
    bar.appendChild(rejectBtn);

    const csvLink = document.createElement("a");
    csvLink.href = "/admin/export.csv";
    csvLink.textContent = "Export CSV";
    csvLink.style.marginLeft = "8px";
    bar.appendChild(csvLink);

    nav.parentElement.insertBefore(bar, nav.nextSibling);
}

initAdminPanel();
