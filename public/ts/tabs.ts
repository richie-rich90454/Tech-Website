"use strict";
// FAQ tab switcher (web landing page).
(function () {
    var tabs = document.querySelectorAll("[data-faq-tab]");
    var panels = document.querySelectorAll("[data-faq-panel]");
    if (!tabs.length || !panels.length) return;
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
            var target = tab.getAttribute("data-faq-tab");
            tabs.forEach(function (t) { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
            panels.forEach(function (p) {
                p.style.display = p.getAttribute("data-faq-panel") === target ? "" : "none";
            });
        });
    });
})();
