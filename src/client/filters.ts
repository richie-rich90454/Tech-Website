// Auto-submit filter forms when checkboxes change (TL pages).
// NOTE: NodeList has no .forEach in IE11 - always iterate via Array.prototype.
const filterBoxes = document.querySelectorAll<HTMLInputElement>(
    "form.filters input[type=checkbox]"
);
Array.prototype.forEach.call(filterBoxes, function (cb: HTMLInputElement) {
    cb.addEventListener("change", function () {
        const form = cb.closest("form");
        if (form) form.submit();
    });
});
