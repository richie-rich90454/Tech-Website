import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/lib/db/generated/main';
import * as bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(HERE, '..');
const dbPath = resolve(PROJECT_ROOT, 'prisma', 'main.db');
process.env.DATABASE_URL_MAIN = process.env.DATABASE_URL_MAIN ?? `file:${dbPath}`;

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL_MAIN,
});
const prisma = new PrismaClient({ adapter });

// 15 strand columns on the domains table, in the same order the workbooks
// emit them. Each row is the boolean tag for one tool.
const DOMAIN_FIELDS = [
    'R',
    'TP',
    'MT',
    'AR',
    'U',
    'MDL',
    'RA',
    'RoTech',
    'LS',
    'RoThink',
    'EoST',
    'EF',
    'RTE',
    'DLoI',
    'RaAoC',
] as const;

type DomainField = (typeof DOMAIN_FIELDS)[number];

interface ParsedTool {
    techname: string;
    tl1_desc: string;
    tl2_desc: string;
    tl3_desc: string;
    tl4_desc: string;
    link: string;
    displaytext: string;
    accepted: boolean;
    domains: Record<DomainField, boolean>;
}

function parseBool(raw: string): boolean {
    const v = raw.trim().toLowerCase();
    return v === '1' || v === 'true' || v === 'yes' || v === 'y';
}

function loadTools(): ParsedTool[] {
    const toolsPath = resolve(PROJECT_ROOT, 'tools.txt');
    const raw = readFileSync(toolsPath, 'utf8');

    // tools.txt may contain two sections: one from tools2.xlsx and one from
    // tools3_beardwood_edit.xlsx. The first line of each section is a label
    // like "tools2" or "tools3_beardwood", followed by a column header. We
    // detect each section header and split accordingly so that tools3
    // entries override tools2 entries with the same name.
    const blocks: string[] = [];
    let current: string[] = [];
    for (const line of raw.split('\n')) {
        if (/^tools\d/i.test(line.trim())) {
            if (current.length > 0) blocks.push(current.join('\n'));
            current = [line];
        } else if (current.length > 0) {
            current.push(line);
        }
    }
    if (current.length > 0) blocks.push(current.join('\n'));

    if (blocks.length === 0) {
        console.log('  (no tool sections found in tools.txt)');
        return [];
    }

    // First pass: collect all entries from each section. Second pass: tools3
    // (the Beardwood edit) takes precedence over tools2 with the same name.
    const byName = new Map<string, ParsedTool>();
    for (const block of blocks) {
        for (const tool of splitSection(block)) {
            byName.set(tool.techname, tool);
        }
    }

    return Array.from(byName.values());
}

/**
 * Each section begins with the workbook title on its own line, then the
 * column header (which starts with "techname"), then the data rows. We skip
 * the first two lines and additionally guard against any header line that
 * happens to slip through (e.g. a blank section).
 */
function splitSection(block: string): ParsedTool[] {
    const lines = block
        .split('\n')
        .map((l) => l.replace(/\r$/, ''))
        .filter((l) => l.length > 0);
    if (lines.length < 2) return [];
    const rows = lines.slice(2);
    const tools: ParsedTool[] = [];
    for (const row of rows) {
        const cols = row.split('\t');
        if (cols.length < 8) continue;
        const [
            techname,
            tl1_desc,
            tl2_desc,
            tl3_desc,
            tl4_desc,
            link,
            displaytext,
            accepted,
            ...rest
        ] = cols;
        if (!techname || !techname.trim()) continue;
        // Defensive: skip a column header that landed in the data section
        if (techname.trim().toLowerCase() === 'techname') continue;
        const domains = {} as Record<DomainField, boolean>;
        for (let i = 0; i < DOMAIN_FIELDS.length; i += 1) {
            domains[DOMAIN_FIELDS[i]] = parseBool((rest[i] ?? '0').trim());
        }
        tools.push({
            techname: techname.trim(),
            tl1_desc: (tl1_desc ?? '').trim(),
            tl2_desc: (tl2_desc ?? '').trim(),
            tl3_desc: (tl3_desc ?? '').trim(),
            tl4_desc: (tl4_desc ?? '').trim(),
            link: (link ?? '').trim(),
            displaytext: (displaytext ?? '').trim() || techname.trim(),
            accepted: parseBool((accepted ?? '0').trim()),
            domains,
        });
    }
    return tools;
}

async function main(): Promise<void> {
    console.log('Seeding main database...');

    const hashedPW = await bcrypt.hash('admin123', 10);
    await prisma.login.upsert({
        where: { User: 'admin' },
        update: { PW: hashedPW },
        create: { User: 'admin', PW: hashedPW },
    });
    console.log('  ✓ Admin login (admin / admin123)');

    // Per-tool upsert. We assign a stable, sequential id (1, 2, 3, …) so the
    // /testuploads/<id>.png filenames line up with the rows.
    const tools = loadTools();
    console.log(`  · Parsed ${tools.length} tools from tools.txt`);

    // First, wipe any existing domain rows so we don't accumulate stale tags
    // when a tool is removed from the workbook. Submission rows will be
    // upserted in place.
    await prisma.domains.deleteMany({});

    let i = 0;
    for (const tool of tools) {
        i += 1;
        const submissionData = {
            id: i,
            techname: tool.techname,
            tl1_desc: tool.tl1_desc,
            tl2_desc: tool.tl2_desc,
            tl3_desc: tool.tl3_desc,
            tl4_desc: tool.tl4_desc,
            link: tool.link,
            displaytext: tool.displaytext,
            accepted: tool.accepted,
            username: 'seed',
            contact: 'seed@bibs-c.local',
        };
        await prisma.submission.upsert({
            where: { id: i },
            update: submissionData,
            create: submissionData,
        });
        await prisma.domains.create({
            data: {
                id: i,
                ...tool.domains,
            },
        });
    }

    console.log(`  ✓ ${tools.length} submissions + domains populated`);
    console.log('Main database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
