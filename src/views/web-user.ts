/**
 * WEB USER PAGE VIEWS - plan, tickets, giftcards, affiliate, wheel.
 * Plan cards are DATA-DRIVEN from the plans table (price/length/mbt/
 * concurrents/vip), matching the legacy template exactly.
 */

import { markup, unsafe, type Html } from '../core/04-html';
import { shell } from './shell';
import { webHeader } from './web-public';
import type { PlanRow } from '../types/db';

const YEN = '\u00a5';
const EMPTY: Html = unsafe('');

function webShell(title: string, body: Html): string {
    return shell({ title, body, css: ['webtheme.css'] });
}

function breadcrumb(page: string, crumb?: string): Html {
    const crumbText = crumb ?? page;
    return markup`<div class="page-breadcrumb"><div class="d-flex align-items-center"><h4 class="page-title text-truncate text-white font-weight-medium mb-0">${page}</h4><div class="ml-auto"><nav aria-label="breadcrumb"><ol class="breadcrumb m-0 p-0"><li class="breadcrumb-item text-sql" aria-current="page">IPstress</li><li class="breadcrumb-item text-muted" aria-current="page">${crumbText}</li></ol></nav></div></div></div>`;
}

export function planView(plans: PlanRow[]): string {
    const vipBadge = (vip: number): Html =>
        vip
            ? markup`<span style="color:#22ca80;font-weight:bold" class="fa fa-check"></span>`
            : markup`<span style="color:#da4453;font-weight:bold" class="fa fa-times"></span>`;
    const card = (p: PlanRow): Html =>
        markup`<div class="col-md-4 grid-margin stretch-card"><div class="card"><div class="card-body"><h5 class="text-center text-uppercase mt-3 mb-4">${p.name}</h5><h3 class="text-center font-weight-light">${p.price}${YEN}</h3><p class="text-muted text-center mb-4 font-weight-light">Duration: ${p.length} day${p.length === 1 ? '' : 's'}</p><div class="d-flex align-items-center mb-2"><p><i class="fa fa-minus" aria-hidden="true"></i> Max Attack Time: <b>${p.mbt}s</b></p></div><div class="d-flex align-items-center mb-2"><p><i class="fa fa-minus" aria-hidden="true"></i> Concurrents: <b>${p.concurrents}</b></p></div><div class="d-flex align-items-center mb-2"><p><i class="fa fa-minus" aria-hidden="true"></i> <b>Unlimited Attacks</b></p></div><div class="d-flex align-items-center mb-2"><p><i class="fa fa-minus" aria-hidden="true"></i> VIP: ${vipBadge(Number(p.vip))}</p></div><a class="link-effect" href="https://t.me/UsdtNL_bot" target="_blank" rel="noopener noreferrer"><button class="btn btn-success btn-border btn-lg w-100 fw-bold mb-3" type="button">Buy Now</button></a></div></div></div>`;
    return webShell(
        'Plans · IPstress',
        markup`${webHeader()}${breadcrumb('Plans')}<div class="container-fluid"><div class="row">${plans.map(card)}</div></div>`
    );
}

export function ticketsView(): string {
    // Authed layout: striped table hydrated from GET /web/api/tickets.
    return webShell(
        'Tickets · IPstress',
        markup`${webHeader()}${breadcrumb('Support Tickets', 'Tickets')}<div class="container-fluid"><div class="row"><div class="col-12"><div class="card"><div class="card-body"><div class="d-flex justify-content-between align-items-center mb-4"><h4 class="card-title">My Tickets</h4><a class="btn btn-primary" href="/web/tickets/new">New Ticket</a></div><div class="table-responsive"><table class="table table-striped"><thead><tr><th>ID</th><th>Subject</th><th>Status</th><th>Date</th><th>Action</th></tr></thead><tbody><tr><td colSpan="5" class="text-center text-muted">Loading tickets...</td></tr></tbody></table></div></div></div></div></div></div>`
    );
}

export function ticketNewView(): string {
    return webShell(
        'New Ticket · IPstress',
        markup`${webHeader()}${breadcrumb('New Ticket')}<div class="container-fluid"><div class="row"><div class="col-md-8 col-lg-6 mx-auto"><div class="card"><div class="card-body"><h4 class="card-title">Create Support Ticket</h4><div class="mt-4 activity"><form action="/web/api/tickets" method="post"><div class="form-group"><label class="text-white" for="subject">Subject</label><input class="form-control" id="subject" type="text" placeholder="Enter ticket subject" required name="subject"/></div><div class="form-group"><label class="text-white" for="content">Message</label><textarea class="form-control" id="content" name="content" rows="6" placeholder="Describe your issue..." required></textarea></div><button type="submit" class="btn btn-primary btn-block">Create Ticket</button></form></div></div></div></div></div></div>`
    );
}

export function giftcardsView(): string {
    return webShell(
        'Gift Cards · IPstress',
        markup`${webHeader()}${breadcrumb('Gift Cards')}<div class="container-fluid"><div class="row"><div class="col-md-8 col-lg-6 mx-auto"><div class="card"><div class="card-body"><h4 class="card-title">Redeem Gift Card</h4><div class="mt-4 activity"><form action="/web/api/giftcards/redeem" method="post"><div class="form-group"><label class="text-white" for="code">Gift Card Code</label><input class="form-control" id="code" type="text" placeholder="Enter your gift card code" required value="" name="code"/></div><button type="submit" class="btn btn-primary btn-block">Redeem</button></form></div></div></div></div></div></div>`
    );
}

export function affiliateView(): string {
    const withdrawForm = markup`<form action="/web/api/affiliate/withdraw" method="post"><div class="form-group"><label class="text-white" for="paymentMethod">Payment Method</label><select class="form-control" id="paymentMethod" required name="paymentMethod"><option value="" selected>Select method...</option><option value="BTC">Bitcoin (BTC)</option><option value="LTC">Litecoin (LTC)</option><option value="ETH">Ethereum (ETH)</option><option value="PayPal">PayPal</option></select></div><div class="form-group"><label class="text-white" for="paymentAddress">Payment Address</label><input class="form-control" id="paymentAddress" type="text" placeholder="Enter your wallet address or email" required value="" name="paymentAddress"/></div><div class="form-group"><label class="text-white" for="amount">Amount (${YEN})</label><input class="form-control" id="amount" type="number" placeholder="Enter amount to withdraw" min="1" required value="" name="amount"/></div><button type="submit" class="btn btn-primary btn-block">Request Withdrawal</button></form>`;
    return webShell(
        'Affiliate · IPstress',
        markup`${webHeader()}${breadcrumb('Affiliate')}<div class="container-fluid"><div class="row"><div class="col-md-6"><div class="card"><div class="card-body"><h4 class="card-title">Affiliate Stats</h4><div class="mt-4 activity"><p class="text-muted">Loading stats...</p></div></div></div></div><div class="col-md-6"><div class="card"><div class="card-body"><h4 class="card-title">Withdraw Balance</h4><div class="mt-4 activity">${withdrawForm}</div></div></div></div></div></div>`
    );
}

export function wheelView(): string {
    const spinner = markup`<div class="mt-4"><div id="superwheel" style="margin:0 auto;max-width:400px"></div><button class="btn btn-danger btn-lg mt-4" disabled>SPIN NOW</button></div>`;
    return shell({
        title: 'Wheel · IPstress',
        css: ['webtheme.css'],
        scripts: ['wheel.js'],
        body: markup`${webHeader()}${breadcrumb('Lucky Wheel', 'Wheel')}<div class="container-fluid"><div class="row"><div class="col-md-8 col-lg-6 mx-auto"><div class="card"><div class="card-body text-center"><h4 class="card-title">Spin &amp; Win</h4><p class="text-muted">Try your luck and win exciting prizes!</p>${spinner}</div></div></div></div></div>`,
    });
}

export { EMPTY };
