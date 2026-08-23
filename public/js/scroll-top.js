"use strict";
(function() {
  var btn = document.getElementById("topbutton");
  var bar = document.getElementById("bar");
  if (!btn || !bar) return;
  window.addEventListener("scroll", function() {
    var y = document.body.scrollTop || document.documentElement.scrollTop;
    btn.style.display = y > bar.offsetTop ? "block" : "none";
  });
  btn.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
