import 'server-only';
import { webDb } from '@/lib/db/web';
import type { UserRow } from '@/types/db';

export interface CreateUserInput {
    username: string;
    password: string;
    rank: number;
    membership: number;
    expire: number;
    status: number;
    referral: string;
    testattack: number;
    twoauth: number;
    referedBy: number;
}

export async function getUserById(id: number): Promise<UserRow | null> {
    return webDb.users.findUnique({ where: { ID: id } });
}

export async function getUserByUsername(username: string): Promise<UserRow | null> {
    return webDb.users.findFirst({ where: { username } });
}

export async function getAllUsers(
    options: {
        skip?: number;
        take?: number;
    } = {}
): Promise<UserRow[]> {
    return webDb.users.findMany({
        orderBy: { ID: 'desc' },
        skip: options.skip ?? 0,
        take: options.take ?? 50,
    });
}

export async function getUserCount(): Promise<number> {
    return webDb.users.count();
}

export async function getActiveUserCount(): Promise<number> {
    return webDb.users.count({ where: { membership: { not: 0 } } });
}

export async function getBannedUserCount(): Promise<number> {
    return webDb.users.count({ where: { status: 1 } });
}

export async function getVipUserCount(): Promise<number> {
    return webDb.users.count({ where: { rank: { gt: 0 } } });
}

export async function createUser(data: CreateUserInput): Promise<UserRow> {
    return webDb.users.create({
        data: {
            ...data,
            referralbalance: 0,
            activity: 0,
        },
    });
}

export async function updateUser(
    id: number,
    data: Partial<Omit<CreateUserInput, 'username'>>
): Promise<UserRow> {
    return webDb.users.update({ where: { ID: id }, data });
}

export async function setUserStatus(id: number, status: number): Promise<UserRow> {
    return webDb.users.update({ where: { ID: id }, data: { status } });
}

export async function deleteUser(id: number): Promise<void> {
    await webDb.users.delete({ where: { ID: id } });
}

export async function recordLogin(id: number, ip: string, userAgent: string): Promise<UserRow> {
    return webDb.users.update({
        where: { ID: id },
        data: { login_ip: ip, login_useragent: userAgent },
    });
}
