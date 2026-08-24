'use strict';
// Lucky Wheel: canvas spinner + API round-trip.
// Server decides the prize; this only draws and animates.
(function () {
    var container = document.getElementById('superwheel');
    var button = document.querySelector('.btn.btn-danger.btn-lg.mt-4');
    if (!container || !button) return;
    // Narrow once so closures below see non-null, immutable references.
    var host = container;
    var spinButton = button;

    var W = 400;
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = W;
    host.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var g = ctx;

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

    function draw(): void {
        g.clearRect(0, 0, W, W);
        g.save();
        g.translate(W / 2, W / 2);
        g.rotate(currentRotation);
        for (var i = 0; i < SEGMENTS; i++) {
            g.beginPath();
            g.moveTo(0, 0);
            g.arc(0, 0, W / 2 - 2, i * ARC, (i + 1) * ARC);
            g.closePath();
            g.fillStyle = COLORS[i % COLORS.length];
            g.fill();
            g.strokeStyle = '#333';
            g.lineWidth = 1;
            g.stroke();
        }
        // Center hub
        g.beginPath();
        g.arc(0, 0, 30, 0, Math.PI * 2);
        g.fillStyle = '#fff';
        g.fill();
        g.restore();
    }

    draw();

    spinButton.addEventListener('click', function () {
        if (spinning) return;
        spinning = true;
        spinButton.setAttribute('disabled', 'true');

        // XHR instead of fetch: IE11 compatibility.
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/web/api/wheel/spin', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status < 200 || xhr.status >= 300) {
                spinning = false;
                spinButton.removeAttribute('disabled');
                return;
            }
            var data: { prize?: number } = {};
            try {
                data = JSON.parse(xhr.responseText) as { prize?: number };
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
            spinButton.removeAttribute('disabled');
        };
        xhr.send();

        function done(): void {
            spinning = false;
            spinButton.removeAttribute('disabled');
        }
    });

    function animateTo(target: number, durationMs: number, cb: () => void): void {
        var start = performance.now();
        var from = currentRotation;
        requestAnimationFrame(step);
        function step(now: number): void {
            var t = Math.min((now - start) / durationMs, 1);
            var ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
            currentRotation = from + (target - from) * ease;
            draw();
            if (t < 1) requestAnimationFrame(step);
            else cb();
        }
    }
})();
