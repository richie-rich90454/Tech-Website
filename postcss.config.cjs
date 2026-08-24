/**
 * POSTCSS PIPELINE - transpiles modern CSS in dist/public/css down for
 * older engines (IE11 first): autoprefixer adds -ms- flexbox etc.
 *
 * Runs against the DIST copy so the tracked sources in public/css stay in
 * their clean, modern form. IE11 additionally gets:
 *   - ie11-custom-properties runtime polyfill (var() support)
 *   - public/css/ie.css overrides (flex-gap, grid, clamp fallbacks)
 */
module.exports = {
    plugins: [
        require("autoprefixer")({
            overrideBrowserslist: ["ie 11", "> 0.5%", "not dead"],
            grid: false, // grids are hand-converted to flex in source; -ms-grid is a trap
        }),
    ],
};
