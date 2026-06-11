import { NextRequest, NextResponse } from 'next/server';
import { mainDb } from '@/lib/db/main';

const DOMAIN_FIELDS = [
  'R', 'TP', 'MT', 'AR', 'U', 'MDL', 'RA', 'RoTech',
  'LS', 'RoThink', 'EoST', 'EF', 'RTE', 'DLoI', 'RaAoC',
] as const;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const id = body.id1 as number;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    // Update submission table
    await mainDb.submission.update({
      where: { id },
      data: {
        techname: body.Techname || '',
        link: body.Link || '',
        displaytext: body.display || '',
        tl1_desc: body.description || '',
        tl2_desc: body.description2 || '',
        tl3_desc: body.description3 || '',
        tl4_desc: body.description4 || '',
      },
    });

    // Build domains update data
    const domainData: Record<string, boolean> = {};
    for (const field of DOMAIN_FIELDS) {
      domainData[field] = body[field] === true || body[field] === 'on' || body[field] === 1;
    }

    await mainDb.domains.update({
      where: { id },
      data: domainData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Edit error:', error);
    return NextResponse.json({ error: 'Edit failed.' }, { status: 500 });
  }
}