import { NextRequest, NextResponse } from 'next/server';
import { mainDb } from '@/lib/db/main';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const formData = await req.formData();

        const techname = formData.get('techname') as string;
        const link = formData.get('link') as string;
        const displaytext = formData.get('displaytext') as string;

        const errors: string[] = [];
        if (!techname) errors.push('Tool name is required');
        if (!link) errors.push('Link is required');
        if (!displaytext) errors.push('Display text is required');

        if (errors.length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const tl1_desc = (formData.get('tl1_desc') as string) || '';
        const tl2_desc = (formData.get('tl2_desc') as string) || '';
        const tl3_desc = (formData.get('tl3_desc') as string) || '';
        const tl4_desc = (formData.get('tl4_desc') as string) || '';
        const username = (formData.get('username') as string) || '';
        const contact = (formData.get('contact') as string) || '';

        // Get next ID
        const maxSub = await mainDb.submission.findFirst({
            orderBy: { id: 'desc' },
            select: { id: true },
        });
        const nextId = (maxSub?.id || 0) + 1;

        // Handle file upload
        const file = formData.get('screenshot') as File | null;
        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadPath = path.join(process.cwd(), 'public', 'testuploads', `${nextId}.png`);
            await writeFile(uploadPath, buffer);
        }

        // Parse domain checkboxes
        const getBool = (name: string) => formData.get(name) === 'true';

        await mainDb.submission.create({
            data: {
                id: nextId,
                techname,
                link,
                displaytext,
                tl1_desc,
                tl2_desc,
                tl3_desc,
                tl4_desc,
                username,
                contact,
                accepted: false,
            },
        });

        await mainDb.domains.create({
            data: {
                id: nextId,
                R: getBool('R'),
                TP: getBool('TP'),
                MT: getBool('MT'),
                AR: getBool('AR'),
                U: getBool('U'),
                MDL: getBool('MDL'),
                RA: getBool('RA'),
                RoTech: getBool('RoTech'),
                LS: getBool('LS'),
                RoThink: getBool('RoThink'),
                EoST: getBool('EoST'),
                EF: getBool('EF'),
                RTE: getBool('RTE'),
                DLoI: getBool('DLoI'),
                RaAoC: getBool('RaAoC'),
            },
        });

        return NextResponse.redirect(new URL('/', req.url));
    } catch (error) {
        console.error('Submission error:', error);
        return NextResponse.json({ errors: ['Internal server error'] }, { status: 500 });
    }
}
