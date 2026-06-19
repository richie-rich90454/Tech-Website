import 'server-only';
import { webDb } from '@/lib/db/web';
import type { LogRow, LoginLogRow } from '@/types/db';

export interface CreateLogInput {
    user: string;
    ip: string;
    time: number;
    method: string;
    postdata: string;
    mode: string;
    ratelimit: string;
    cookie: string;
    date: number;
    chart: string;
    stopped: number;
    handler: string;
    origin: string;
}

export async function createLog(data: CreateLogInput): Promise<LogRow> {
    return webDb.logs.create({ data });
}

export async function getAllLogs(
    options: {
        skip?: number;
        take?: number;
    } = {}
): Promise<LogRow[]> {
    return webDb.logs.findMany({
        orderBy: { id: 'desc' },
        skip: options.skip ?? 0,
        take: options.take ?? 50,
    });
}

export async function getLogsByUser(user: string): Promise<LogRow[]> {
    return webDb.logs.findMany({ where: { user }, orderBy: { id: 'desc' } });
}

export async function getRunningLogs(): Promise<LogRow[]> {
    const now = Math.floor(Date.now() / 1000);
    return webDb.logs.findMany({
        where: { stopped: 0, date: { lte: now } },
        orderBy: { id: 'desc' },
    });
}

export async function getRunningLogsByUser(user: string): Promise<LogRow[]> {
    const now = Math.floor(Date.now() / 1000);
    return webDb.logs.findMany({
        where: { user, stopped: 0, date: { lte: now } },
        orderBy: { id: 'desc' },
    });
}

export async function stopLog(id: number): Promise<LogRow> {
    return webDb.logs.update({ where: { id }, data: { stopped: 1 } });
}

export async function getLogCount(): Promise<number> {
    return webDb.logs.count();
}

export async function getRunningLogCount(): Promise<number> {
    const now = Math.floor(Date.now() / 1000);
    return webDb.logs.count({ where: { stopped: 0, date: { lte: now } } });
}

export async function getLoginLogs(
    options: {
        skip?: number;
        take?: number;
    } = {}
): Promise<LoginLogRow[]> {
    return webDb.loginlogs.findMany({
        orderBy: { id: 'desc' },
        skip: options.skip ?? 0,
        take: options.take ?? 50,
    });
}

export async function createLoginLog(data: {
    username: string;
    ip: string;
    date: number;
    country: string;
}): Promise<LoginLogRow> {
    return webDb.loginlogs.create({ data });
}
