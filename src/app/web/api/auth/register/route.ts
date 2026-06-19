import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';
import bcrypt from 'bcryptjs';
import { webRegisterSchema } from '@/lib/validations/web-auth';
import { loginWebSession } from '@/lib/auth/web';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const formData = await req.formData();
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        const parsed = webRegisterSchema.safeParse({ username, password, confirmPassword });
        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message || 'Validation failed';
            return NextResponse.json({ error: firstError }, { status: 400 });
        }

        // Check reCAPTCHA if configured
        const recaptchaResponse = formData.get('g-recaptcha-response') as string;
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        if (recaptchaSecret && recaptchaResponse) {
            try {
                const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `secret=${recaptchaSecret}&response=${recaptchaResponse}`,
                });
                const verifyData = await verifyRes.json();
                if (!verifyData.success) {
                    return NextResponse.json(
                        { error: 'Captcha verification failed.' },
                        { status: 400 }
                    );
                }
            } catch {
                // Skip reCAPTCHA check on failure
            }
        }

        // Check if username already exists
        const existing = await webDb.users.findFirst({ where: { username } });
        if (existing) {
            return NextResponse.json({ error: 'Username is already taken' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const trialDate = new Date();
        trialDate.setDate(trialDate.getDate() + 7);
        const trialTimestamp = Math.floor(trialDate.getTime() / 1000);

        const newUser = await webDb.users.create({
            data: {
                username,
                password: hashedPassword,
                rank: 0,
                membership: 0,
                expire: trialTimestamp,
                status: 0,
                referral: '0',
                referralbalance: 0,
                testattack: 0,
                activity: 0,
                twoauth: 0,
                referedBy: 0,
            },
        });

        await loginWebSession({ id: newUser.ID, username: newUser.username, rank: newUser.rank });

        return NextResponse.json(
            { success: 'You have successfully registered! Redirecting...' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
