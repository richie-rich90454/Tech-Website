"use strict";
// Auto-submit filter forms when checkboxes change (TL pages).
document.querySelectorAll("form.filters input[type=checkbox]").forEach(function (cb) {
    cb.addEventListener("change", function () {
        var form = cb.closest("form");
        if (form) form.submit();
    });
});
