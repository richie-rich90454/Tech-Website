import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Mirrors prisma/schema-web.prisma. Property/column names match Prisma fields
// exactly. IDs that were `@default(autoincrement())` use primaryKey({autoIncrement:true}).
export const twoauthsettings = sqliteTable('2authsettings', {
    secret: text('secret').primaryKey(),
});

export const actions = sqliteTable('actions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    admin: text('admin').notNull().default(''),
    client: text('client').notNull().default(''),
    action: text('action').notNull().default(''),
    date: integer('date').notNull().default(0),
});

export const affiliateWithdraws = sqliteTable('affiliateWithdraws', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    userID: integer('userID').notNull().default(0),
    withdrawAmount: text('withdrawAmount').notNull().default(''),
    paymentMethod: text('paymentMethod').notNull().default(''),
    paymentAddress: text('paymentAddress').notNull().default(''),
    status: integer('status').notNull().default(0),
    date: integer('date').notNull().default(0),
});

export const api = sqliteTable('api', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().default(''),
    api: text('api').notNull().default(''),
    slots: integer('slots').notNull().default(0),
    methods: text('methods').notNull().default(''),
    vip: integer('vip').notNull().default(0),
});

export const bans = sqliteTable('bans', {
    username: text('username').primaryKey(),
    reason: text('reason').notNull().default(''),
});

export const blacklist = sqliteTable('blacklist', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    data: text('data').notNull().default(''),
    type: text('type').notNull().default(''),
});

export const cark = sqliteTable('cark', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    plan: integer('plan').notNull().default(0),
    sans: text('sans'),
});

export const faq = sqliteTable('faq', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    question: text('question').notNull().default(''),
    answer: text('answer').notNull().default(''),
});

export const fe = sqliteTable('fe', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    userID: integer('userID').notNull().default(0),
    type: text('type').notNull().default(''),
    ip: text('ip').notNull().default(''),
});

export const giftcards = sqliteTable('giftcards', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    code: text('code').notNull().default(''),
    planID: integer('planID').notNull().default(0),
    claimedby: integer('claimedby').notNull().default(0),
    dateClaimed: integer('dateClaimed').notNull().default(0),
    date: integer('date').notNull().default(0),
    user: text('user'),
});

export const iplogs = sqliteTable('iplogs', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    userID: integer('userID').notNull().default(0),
    logged: text('logged').notNull().default(''),
    date: integer('date').notNull().default(0),
});

export const loginlogs = sqliteTable('loginlogs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().default(''),
    ip: text('ip').notNull().default(''),
    date: integer('date').notNull().default(0),
    country: text('country').notNull().default(''),
});

export const logs = sqliteTable('logs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user: text('user').notNull().default(''),
    ip: text('ip').notNull().default(''),
    time: integer('time').notNull().default(0),
    method: text('method').notNull().default(''),
    postdata: text('postdata').notNull().default(''),
    mode: text('mode').notNull().default(''),
    ratelimit: text('ratelimit').notNull().default(''),
    cookie: text('cookie').notNull().default(''),
    date: integer('date').notNull().default(0),
    chart: text('chart').notNull().default(''),
    stopped: integer('stopped').notNull().default(0),
    handler: text('handler').notNull().default(''),
    origin: text('origin').notNull().default(''),
});

export const messages = sqliteTable('messages', {
    messageid: integer('messageid').primaryKey({ autoIncrement: true }),
    ticketid: integer('ticketid').notNull().default(0),
    content: text('content').notNull().default(''),
    sender: text('sender').notNull().default(''),
    date: integer('date').notNull().default(0),
});

export const methods = sqliteTable('methods', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().default(''),
    fullname: text('fullname').notNull().default(''),
    type: text('type').notNull().default(''),
    command: text('command').notNull().default(''),
});

export const news = sqliteTable('news', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    title: text('title').notNull().default(''),
    content: text('content').notNull().default(''),
    date: text('date').notNull().default(''),
});

export const payments = sqliteTable('payments', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    paid: real('paid').notNull().default(0),
    plan: integer('plan').notNull().default(0),
    user: integer('user').notNull().default(0),
    email: text('email').notNull().default(''),
    tid: text('tid').notNull().default(''),
    date: integer('date').notNull().default(0),
});

export const ping_sessions = sqliteTable('ping_sessions', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    ping_key: text('ping_key').notNull().default(''),
    user_id: integer('user_id').notNull().default(0),
    ping_ip: text('ping_ip').notNull().default(''),
    ping_port: text('ping_port').notNull().default(''),
});

export const plans = sqliteTable('plans', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().default(''),
    vip: integer('vip').notNull().default(0),
    mbt: integer('mbt').notNull().default(0),
    unit: text('unit').notNull().default(''),
    length: integer('length').notNull().default(0),
    price: real('price').notNull().default(0),
    concurrents: integer('concurrents').notNull().default(0),
    private: integer('private').notNull().default(0),
});

export const reports = sqliteTable('reports', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().default(''),
    report: text('report').notNull().default(''),
    date: integer('date').notNull().default(0),
});

export const servers = sqliteTable('servers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().default(''),
    ip: text('ip').notNull().default(''),
    password: text('password').notNull().default(''),
    slots: integer('slots').notNull().default(0),
    methods: text('methods').notNull().default(''),
});

export const settings = sqliteTable('settings', {
    sitename: text('sitename').primaryKey(),
    stripePubKey: text('stripePubKey').notNull().default(''),
    url: text('url').notNull().default(''),
    description: text('description').notNull().default(''),
    cooldown: integer('cooldown').notNull().default(0),
    cooldownTime: integer('cooldownTime').notNull().default(0),
    paypal: text('paypal').notNull().default(''),
    bitcoin: text('bitcoin').notNull().default(''),
    stripe: integer('stripe').notNull().default(0),
    maintaince: text('maintaince').notNull().default(''),
    rotation: integer('rotation').notNull().default(0),
    system: text('system').notNull().default(''),
    maxattacks: integer('maxattacks').notNull().default(0),
    testboots: integer('testboots').notNull().default(0),
    cloudflare: integer('cloudflare').notNull().default(0),
    skype: text('skype').notNull().default(''),
    key: text('key').notNull().default(''),
    issuerId: text('issuerId').notNull().default(''),
    coinpayments: text('coinpayments').notNull().default(''),
    ipnSecret: text('ipnSecret').notNull().default(''),
    google_site: text('google_site').notNull().default(''),
    google_secret: text('google_secret').notNull().default(''),
    btc_address: text('btc_address').notNull().default(''),
    secretKey: text('secretKey').notNull().default(''),
    cbp: integer('cbp').notNull().default(0),
    paypal_email: text('paypal_email').notNull().default(''),
    theme: text('theme').notNull().default(''),
    logo: text('logo').notNull().default(''),
    stripeSecretKey: text('stripeSecretKey').notNull().default(''),
});

export const smtpsettings = sqliteTable('smtpsettings', {
    host: text('host').primaryKey(),
    auth: text('auth').notNull().default(''),
    username: text('username').notNull().default(''),
    password: text('password').notNull().default(''),
    port: integer('port').notNull().default(0),
});

export const tickets = sqliteTable('tickets', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    subject: text('subject').notNull().default(''),
    content: text('content').notNull().default(''),
    status: text('status').notNull().default(''),
    username: text('username').notNull().default(''),
    date: integer('date').notNull().default(0),
});

export const users = sqliteTable('users', {
    ID: integer('ID').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().default(''),
    password: text('password').notNull().default(''),
    rank: integer('rank').notNull().default(0),
    membership: integer('membership').notNull().default(0),
    expire: integer('expire').notNull().default(0),
    status: integer('status').notNull().default(0),
    referral: text('referral').notNull().default(''),
    referralbalance: integer('referralbalance').notNull().default(0),
    testattack: integer('testattack').notNull().default(0),
    activity: integer('activity').notNull().default(0),
    twoauth: integer('2auth').notNull().default(0),
    referedBy: integer('referedBy').notNull().default(0),
    login_ip: text('login_ip'),
    login_useragent: text('login_useragent'),
    cark: text('cark'),
    ban_sbp: text('ban_sbp'),
});
