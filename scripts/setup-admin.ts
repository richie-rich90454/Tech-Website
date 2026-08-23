import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { mainDb } from '../src/lib/db/main';
import { webDb } from '../src/lib/db/web';

// Rotates or creates admin credentials for BOTH subprojects.
// Usage: ADMIN_USERNAME=admin ADMIN_PASSWORD=<min 8 chars> npm run setup

async function main(): Promise<void> {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        console.error('ADMIN_USERNAME and ADMIN_PASSWORD env vars are required.');
        process.exit(1);
    }
    if (password.length < 8) {
        console.error('ADMIN_PASSWORD must be at least 8 characters.');
        process.exit(1);
    }

    const hash = await bcrypt.hash(password, 10);

    await mainDb.login.upsert({
        where: { User: username },
        update: { PW: hash },
        create: { User: username, PW: hash },
    });

    const existing = await webDb.users.findFirst({ where: { username } });
    if (existing) {
        await webDb.users.update({
            where: { ID: existing.ID },
            data: { password: hash, rank: 1 },
        });
    } else {
        await webDb.users.create({
            data: {
                username,
                password: hash,
                rank: 1,
                membership: 0,
                expire: 9999999999,
                status: 0,
                referral: '',
                referralbalance: 0,
                testattack: 1,
                activity: 0,
                twoauth: 0,
                referedBy: 0,
            },
        });
    }

    console.log(`Admin credentials set for "${username}" in both databases.`);
    await mainDb.$disconnect();
    await webDb.$disconnect();
}

main().catch((e) => {
    console.error('Setup failed:', e);
    process.exit(1);
});
