'use strict';
// Lucky Wheel: canvas spinner + API round-trip.
// Server decides the prize; this only draws and animates.
(function () {
    var container = document.getElementById('superwheel');
    var button = document.querySelector('.btn.btn-danger.btn-lg.mt-4');
    if (!container || !button) return;

    var W = 400;
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = W;
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var PRIZES = [10, 50, 0, 20, 100, 5, 15, 0];
    var COLORS = [
        '#17d984',
        '#0a0e27',
        '#22ca80',
        '#1a1f3d',
        '#17d984',
        '#0a0e27',
        '#22ca80',
        '#1a1f3d',
    ];
    var SEGMENTS = PRIZES.length;
    var ARC = (Math.PI * 2) / SEGMENTS;
    var currentRotation = 0;
    var spinning = false;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
        ctx.clearRect(0, 0, W, W);
        ctx.save();
        ctx.translate(W / 2, W / 2);
        ctx.rotate(currentRotation);
        for (var i = 0; i < SEGMENTS; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, W / 2 - 2, i * ARC, (i + 1) * ARC);
            ctx.closePath();
            ctx.fillStyle = COLORS[i % COLORS.length];
            ctx.fill();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        // Center hub
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.restore();
    }

    draw();

    button.addEventListener('click', function () {
        if (spinning) return;
        spinning = true;
        button.setAttribute('disabled', 'true');

        // XHR instead of fetch: IE11 compatibility.
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/web/api/wheel/spin', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status < 200 || xhr.status >= 300) {
                spinning = false;
                button.removeAttribute('disabled');
                return;
            }
            var data: { prize?: number } = {};
            try {
                data = JSON.parse(xhr.responseText);
            } catch (e) {
                /* treat as prize 0 */
            }
            var prizeIndex = data.prize || 0;
            var targetRotation = Math.PI * 2 * 5 + (SEGMENTS - prizeIndex) * ARC + ARC / 2;
            if (reducedMotion) {
                currentRotation = targetRotation;
                draw();
                done();
                return;
            }
            animateTo(targetRotation, 3000, done);
        };
        xhr.onerror = function () {
            spinning = false;
            button.removeAttribute('disabled');
        };
        xhr.send();

        function done() {
            spinning = false;
            button.removeAttribute('disabled');
        }
    });

    function animateTo(target, durationMs, cb) {
        var start = performance.now();
        var from = currentRotation;
        requestAnimationFrame(step);
        function step(now) {
            var t = Math.min((now - start) / durationMs, 1);
            var ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
            currentRotation = from + (target - from) * ease;
            draw();
            if (t < 1) requestAnimationFrame(step);
            else cb();
        }
    }
})();
