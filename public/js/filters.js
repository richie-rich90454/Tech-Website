'use strict';
document.querySelectorAll('form.filters input[type=checkbox]').forEach(function (e) {
    e.addEventListener('change', function () {
        var t = e.closest('form');
        t && t.submit();
    });
});
