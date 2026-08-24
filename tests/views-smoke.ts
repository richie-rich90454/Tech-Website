/**
 * VIEW SMOKE TEST - renders every .ejs template with representative data.
 * No server, no ports, no DB writes: pure in-process function calls.
 * Run: npm run check:views
 */

import { loadViews, render } from '../src/core/views';

const SAMPLES: Record<string, Record<string, unknown>> = {
    home: {
        cards: [
            { id: 'tl1', href: '/tl1', title: 'TL1: Knowing', strands: ['Relationships'] },
            { id: 'tl2', href: '/tl2', title: 'TL2: Strategies', strands: ['Understanding'] },
        ],
    },
    tl: {
        tl: 'tl1',
        config: {
            title: 'Knowing (TL1)',
            strands: [
                {
                    domainColumn: 'R',
                    checkboxName: 's1',
                    label: 'Relationships',
                    cssClass: 'n1',
                    tooltip: 'Relationships tooltip',
                },
            ],
        },
        checked: [true],
        filtered: [
            {
                id: 1,
                techname: 'Kahoot',
                link: 'https://kahoot.com',
                displaytext: 'Kahoot!',
                desc: 'Quiz platform.',
                tags: { R: true },
            },
        ],
    },
    search: {
        heading: 'Results for: quiz',
        q: 'quiz',
        resultCount: 1,
        results: [
            {
                id: 2,
                techname: 'Kahoot',
                link: 'https://kahoot.com',
                displaytext: 'Kahoot!',
                tl1_desc: 'd1',
                tl2_desc: '',
                tl3_desc: '',
                tl4_desc: '',
                activeTags: [{ col: 'R', label: 'Relationships', tl: 'tl1', css: 'n1' }],
            },
        ],
    },
    login: {},
    submission: {},
    admin: {
        subs: [
            {
                id: 3,
                techname: 'Tool X',
                link: 'https://x.com',
                displaytext: 'X',
                tl1_desc: 'a'.repeat(120),
                tl2_desc: '',
                tl3_desc: '',
                tl4_desc: '',
                accepted: false,
            },
        ],
    },
    'admin-edit': {
        id: 3,
        sub: {
            techname: 'Tool X',
            link: 'https://x.com',
            displaytext: 'X',
            tl1_desc: 'a',
            tl2_desc: '',
            tl3_desc: '',
            tl4_desc: '',
        },
        strands: [
            { name: 'R', label: 'Relationship', checked: true },
            { name: 'TP', label: 'Teacher Planning', checked: false },
        ],
    },
    'web-landing': {},
    'web-login': {},
    'web-register': {},
    'web-maintenance': { description: 'Back soon.' },
    'web-hub': { methods: [], servers: [] },
    'web-profile': {
        user: {
            ID: 7,
            username: 'tester',
            referral: 'abc',
            referralbalance: 5,
            expire: 1800000000,
        },
        plan: null,
        expiry: '1/1/2027',
        refLink: 'https://ipstress.com/web/register?ref=abc',
    },
    'web-dashboard': {
        planName: 'Gold',
        maxTime: '3600s',
        maxConcurrents: '3',
        expiry: '1/1/2027',
        runningAttacks: 1,
        totalAttacks: 9,
    },
    'web-plan': {
        plans: [{ ID: 1, name: 'Gold', price: 10, length: 30, mbt: 3600, concurrents: 3, vip: 1 }],
    },
    'web-tickets': {},
    'web-tickets-new': {},
    'web-giftcards': {},
    'web-affiliate': {},
    'web-wheel': {},
    'web-admin-dashboard': {
        s: { totalUsers: 2, activeUsers: 1, totalAttacks: 5, runningAttacks: 0, waitingTickets: 3 },
    },
    'web-admin-users': {
        users: [{ ID: 7, username: 'tester', rank: 0, membership: 0 }],
    },
    'web-admin-user-edit': {
        user: { ID: 7, username: 'tester', rank: 0, membership: 0, expire: 1800000000 },
        plans: [{ ID: 1, name: 'Gold' }],
    },
    'web-admin-plans': {
        plans: [{ ID: 1, name: 'Gold', price: 10, length: 30 }],
    },
    'web-admin-methods': {
        methods: [{ id: 1, name: 'UDP', fullname: 'UDP Flood', type: 'layer4', command: './udp' }],
    },
    'web-admin-news': { news: [{ ID: 1, title: 'Hi', date: '2026-01-01' }] },
    'web-admin-servers': {
        servers: [{ id: 1, name: 'srv1', ip: '1.2.3.4', slots: 10, methods: 'UDP' }],
    },
    'web-admin-giftcards': {
        cards: [{ ID: 1, code: 'GC-AAA-BBB', planID: 1, claimedby: 0, date: 1800000000 }],
        plans: [{ ID: 1, name: 'Gold' }],
    },
    'web-admin-tickets': {
        tickets: [
            { id: 1, subject: 'Help', username: 'tester', status: 'Waiting for admin response', date: 1800000000 },
        ],
    },
    'web-admin-attacklogs': {
        logs: [
            { id: 1, user: 't', ip: '1.1.1.1:80', postdata: '{}', method: 'UDP', time: 30, chart: '-', stopped: 0 },
        ],
    },
    'web-admin-loginlogs': {
        logs: [{ id: 1, username: 't', ip: '1.1.1.1', country: 'US', date: 1800000000 }],
    },
    'web-admin-hub': { layer4: [], layer7: [], servers: [] },
    'web-admin-settings': {
        s: {
            sitename: 'IPstress',
            url: 'https://x.com',
            description: 'd',
            cooldown: 60,
            cooldownTime: 300,
            maxattacks: 5,
            testboots: 1,
        },
    },
};

let failures = 0;

loadViews();
for (const [name, data] of Object.entries(SAMPLES)) {
    try {
        const html = render(name, data);
        const checks = [
            [html.includes('<!doctype html'), 'doctype'],
            [html.includes('</html>'), 'closing html tag'],
            [!/\bundefined\b/.test(html), 'no literal "undefined"'],
        ] as Array<[boolean, string]>;
        const bad = checks.filter(([ok]) => !ok).map(([, what]) => what);
        if (bad.length > 0) {
            failures++;
            console.error(`FAIL ${name}: missing ${bad.join(', ')}`);
        } else {
            console.log(`ok   ${name} (${html.length} bytes)`);
        }
    } catch (err) {
        failures++;
        console.error(`FAIL ${name}: ${(err as Error).message}`);
    }
}

if (failures > 0) {
    console.error(`\n${failures} view(s) failed`);
    process.exit(1);
}
console.log('\nAll views render cleanly.');
