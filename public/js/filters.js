"use strict";
document.querySelectorAll("form.filters input[type=checkbox]").forEach(function(cb) {
  cb.addEventListener("change", function() {
    var form = cb.closest("form");
    if (form) form.submit();
  });
});
