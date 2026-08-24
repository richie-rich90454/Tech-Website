'use strict';
// Lucky Wheel: canvas spinner + API round-trip.
// Server decides the prize; this only draws and animates.
(function () {
    const container = document.getElementById('superwheel');
    const button = document.querySelector('.btn.btn-danger.btn-lg.mt-4');
    if (!container || !button) return;
    // Narrow once so closures below see non-null, immutable references.
    const host = container;
    const spinButton = button;

    const W = 400;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = W;
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const g = ctx;

    const PRIZES = [10, 50, 0, 20, 100, 5, 15, 0];
    const COLORS = [
        '#17d984',
        '#0a0e27',
        '#22ca80',
        '#1a1f3d',
        '#17d984',
        '#0a0e27',
        '#22ca80',
        '#1a1f3d',
    ];
    const SEGMENTS = PRIZES.length;
    const ARC = (Math.PI * 2) / SEGMENTS;
    let currentRotation = 0;
    let spinning = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw(): void {
        g.clearRect(0, 0, W, W);
        g.save();
        g.translate(W / 2, W / 2);
        g.rotate(currentRotation);
        for (let i = 0; i < SEGMENTS; i++) {
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
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/web/api/wheel/spin', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status < 200 || xhr.status >= 300) {
                spinning = false;
                spinButton.removeAttribute('disabled');
                return;
            }
            let data: { prize?: number } = {};
            try {
                data = JSON.parse(xhr.responseText) as { prize?: number };
            } catch (e) {
                /* treat as prize 0 */
            }
            const prizeIndex = data.prize || 0;
            const targetRotation = Math.PI * 2 * 5 + (SEGMENTS - prizeIndex) * ARC + ARC / 2;
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
        const start = performance.now();
        const from = currentRotation;
        requestAnimationFrame(step);
        function step(now: number): void {
            const t = Math.min((now - start) / durationMs, 1);
            const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
            currentRotation = from + (target - from) * ease;
            draw();
            if (t < 1) requestAnimationFrame(step);
            else cb();
        }
    }
})();
