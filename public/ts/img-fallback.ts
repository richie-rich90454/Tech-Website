"use strict";
// Image fallback: swap broken <img> to a placeholder.
var FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23eee'/%3E%3C/svg%3E";
document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    img.addEventListener("error", function () { img.src = FALLBACK; });
});
