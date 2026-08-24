// Scroll-to-top button show/hide + smooth scroll.
function initScrollTop(): void {
    const btn = document.getElementById("topbutton");
    const bar = document.getElementById("bar");
    if (!btn || !bar) return;

    window.addEventListener("scroll", function () {
        const y = document.body.scrollTop || document.documentElement.scrollTop || 0;
        btn.style.display = y > bar.offsetTop ? "block" : "none";
    });
    btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

initScrollTop();
