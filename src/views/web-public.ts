/**
 * ============================================================================
 * WEB PUBLIC VIEWS - /web/login  /web/register  /web/maintenance
 * ============================================================================
 * Shared chrome: WebHeader (lightning-mark brand) + theme stylesheet.
 * Forms gained action= attributes so they work without JavaScript; the legacy
 * build submitted them via fetch. Visual output is unchanged.
 */

import { markup, type Html } from '../core/04-html';
import { shell } from './shell';

export function webHeader(active: 'home' | 'login' | 'register' = 'home'): Html {
    void active;
    return markup`<header class="web-header"><div class="web-header__inner"><a class="web-header__brand" aria-label="IPstress — home" href="/web"><span class="web-header__mark" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"></path></svg></span><span class="web-header__name">IPstress</span></a><nav class="web-header__nav" aria-label="Primary"><ul><li><a href="/web">Home</a></li><li><a href="/web#about">About</a></li><li><a href="/web#plans">Plans</a></li><li><a href="/web#faq">FAQ</a></li></ul></nav><div class="web-header__cta"><a class="web-header__btn web-header__btn--ghost" href="/web/register">Register</a><a class="web-header__btn web-header__btn--solid" href="/web/login">Log in</a></div></div></header>`;
}

function webShell(title: string, body: Html): string {
    return shell({ title, body, css: ['webtheme.css'] });
}

export function webLoginView(): string {
    return webShell(
        'Login · IPstress',
        markup`${webHeader()}<div class="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative"><div class="row justify-content-center"><div class="col-lg-6"><div class="p-3"><div class="card"><div class="card-body"><h2 class="card-title text-center">IPstress</h2><h3 class="card-title text-center">Login</h3><form class="mt-4" method="post" action="/web/api/auth/login"><div class="row"><div class="col-lg-12"><div class="form-group"><label class="text-white" for="username">Username</label><input type="text" class="form-control" placeholder="enter your username" required name="username"/></div></div><div class="col-lg-12"><div class="form-group"><label class="text-white" for="password">Password</label><input type="password" class="form-control" placeholder="enter your password" required name="password"/></div></div><div class="col-lg-12 text-center"><div class="form-group"><button type="submit" class="btn btn-block btn-primary" name="doLogin">Sign In</button></div></div></div></form></div></div><div class="col-lg-12 text-center mt-3">Don&#39;t have an account? <a href="/web/register" class="text-primary">Sign Up</a></div></div></div></div></div>`
    );
}

export function webRegisterView(): string {
    return webShell(
        'Register · IPstress',
        markup`${webHeader()}<div class="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative"><div class="row justify-content-center"><div class="col-lg-5"><div class="p-3"><div class="card"><div class="card-body"><h2 class="card-title text-center">IPstress</h2><h3 class="card-title text-center">Register</h3><form class="mt-4" method="post" action="/web/api/auth/register"><div class="row"><div class="col-lg-12"><div class="form-group"><label class="text-white" for="username">Username</label><input class="form-control" id="username" type="text" placeholder="enter your username" required name="username"/></div></div><div class="col-lg-12"><div class="form-group"><label class="text-white" for="password">Password</label><input class="form-control" id="password" type="password" placeholder="enter your password" required name="password"/></div></div><div class="col-lg-12"><div class="form-group"><label class="text-white" for="confirmPassword">Repeat Password</label><input class="form-control" id="confirmPassword" type="password" placeholder="repeat your password" required name="confirmPassword"/></div></div><div class="col-lg-12 text-center"><div class="form-group"><button type="submit" class="btn btn-block btn-primary" name="doRegister">Sign Up</button></div></div></div></form></div></div><div class="col-lg-12 text-center mt-3">Already have an account? <a href="/web/login" class="text-primary">Sign In</a></div></div></div></div></div>`
    );
}

/** Maintenance gate page - shown when settings.maintaince is enabled. */
export function webMaintenanceView(description: string): string {
    return webShell(
        'Maintenance · IPstress',
        markup`${webHeader()}<div style="display:flex;justify-content:center;align-items:center;min-height:100vh;background:#0a0e27;color:#fff;text-align:center"><div><h1 style="font-size:3rem;margin-bottom:1rem">&#128736; Maintenance Mode</h1><p style="font-size:1.2rem;max-width:600px">${description}</p><a style="color:#0cf293;margin-top:2rem;display:inline-block" href="/web">Return Home</a></div></div>`
    );
}
