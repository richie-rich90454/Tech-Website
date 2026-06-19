import { NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import { getWebSession } from '@/lib/auth/web';

const PRIZES = [
    { id: 0, name: '10¥ Balance', points: 10 },
    { id: 1, name: '5 Extra Attack Seconds', points: 0 },
    { id: 2, name: '50¥ Balance', points: 50 },
    { id: 3, name: 'No Prize', points: 0 },
    { id: 4, name: '20¥ Balance', points: 20 },
    { id: 5, name: '1 Hour VIP', points: 0 },
    { id: 6, name: '100¥ Balance', points: 100 },
    { id: 7, name: 'No Prize', points: 0 },
];

export async function POST(): Promise<NextResponse> {
    try {
        const session = await getWebSession();
        if (!session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Simple random spin
        const prizeIndex = Math.floor(Math.random() * PRIZES.length);
        const prize = PRIZES[prizeIndex];

        // Award points if applicable
        if (prize.points > 0) {
            await webDb.users.update({
                where: { ID: session.userId },
                data: {
                    referralbalance: { increment: prize.points },
                },
            });
        }

        return NextResponse.json({
            prize: prizeIndex,
            prizeName: prize.name,
            points: prize.points,
        });
    } catch (error) {
        console.error('Wheel spin error:', error);
        return NextResponse.json({ error: 'Failed to spin the wheel' }, { status: 500 });
    }
}
