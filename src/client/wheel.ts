// Lucky Wheel: canvas spinner + API round-trip.
// Server decides the prize; this only draws and animates.

const WHEEL_SIZE = 400;
const WHEEL_PRIZES = [10, 50, 0, 20, 100, 5, 15, 0];
const WHEEL_COLORS = [
    '#17d984',
    '#0a0e27',
    '#22ca80',
    '#1a1f3d',
    '#17d984',
    '#0a0e27',
    '#22ca80',
    '#1a1f3d',
];

let wheelRotation = 0;
let wheelSpinning = false;

function wheelDraw(g: CanvasRenderingContext2D): void {
    const segments = WHEEL_PRIZES.length;
    const arc = (Math.PI * 2) / segments;
    g.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);
    g.save();
    g.translate(WHEEL_SIZE / 2, WHEEL_SIZE / 2);
    g.rotate(wheelRotation);
    for (let i = 0; i < segments; i++) {
        g.beginPath();
        g.moveTo(0, 0);
        g.arc(0, 0, WHEEL_SIZE / 2 - 2, i * arc, (i + 1) * arc);
        g.closePath();
        g.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
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

function initWheel(): void {
    const host = document.getElementById('superwheel');
    const foundButton = document.querySelector<HTMLButtonElement>(
        '.btn.btn-danger.btn-lg.mt-4'
    );
    if (!host || !foundButton) return;
    const spinButton = foundButton;

    const canvas = document.createElement('canvas');
    canvas.width = WHEEL_SIZE;
    canvas.height = WHEEL_SIZE;
    host.appendChild(canvas);
    const g = canvas.getContext('2d');
    if (!g) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    wheelDraw(g);

    function animateTo(target: number, durationMs: number, cb: () => void): void {
        const start = performance.now();
        const from = wheelRotation;
        requestAnimationFrame(step);
        function step(now: number): void {
            const t = Math.min((now - start) / durationMs, 1);
            const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
            wheelRotation = from + (target - from) * ease;
            wheelDraw(g as CanvasRenderingContext2D);
            if (t < 1) requestAnimationFrame(step);
            else cb();
        }
    }

    spinButton.addEventListener('click', function () {
        if (wheelSpinning) return;
        wheelSpinning = true;
        spinButton.setAttribute('disabled', 'true');

        // XHR instead of fetch: IE11 compatibility.
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/web/api/wheel/spin', true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status < 200 || xhr.status >= 300) {
                wheelSpinning = false;
                spinButton.removeAttribute('disabled');
                return;
            }
            let prizeIndex = 0;
            try {
                const data = JSON.parse(xhr.responseText) as { prize?: number };
                prizeIndex = data.prize || 0;
            } catch (e) {
                /* treat as prize 0 */
            }
            const segments = WHEEL_PRIZES.length;
            const arc = (Math.PI * 2) / segments;
            const targetRotation = Math.PI * 2 * 5 + (segments - prizeIndex) * arc + arc / 2;
            function done(): void {
                wheelSpinning = false;
                spinButton.removeAttribute('disabled');
            }
            if (reducedMotion) {
                wheelRotation = targetRotation;
                wheelDraw(g as CanvasRenderingContext2D);
                done();
                return;
            }
            animateTo(targetRotation, 3000, done);
        };
        xhr.onerror = function () {
            wheelSpinning = false;
            spinButton.removeAttribute('disabled');
        };
        xhr.send();
    });
}

initWheel();
