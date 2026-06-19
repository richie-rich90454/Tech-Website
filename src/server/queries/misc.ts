import 'server-only';
import { webDb } from '@/lib/db/web';
import type {
    NewsRow,
    GiftCardRow,
    ServerRow,
    MethodRow,
    SettingsRow,
    PaymentRow,
} from '@/types/db';

export async function getSettings(): Promise<SettingsRow | null> {
    return webDb.settings.findFirst();
}

export async function updateSettings(
    data: Partial<Omit<SettingsRow, 'sitename'>>
): Promise<SettingsRow> {
    const existing = await webDb.settings.findFirst();
    if (existing) {
        return webDb.settings.update({ where: { sitename: existing.sitename }, data });
    }
    return webDb.settings.create({
        data: data as SettingsRow & { sitename: string },
    });
}

export async function getAllNews(): Promise<NewsRow[]> {
    return webDb.news.findMany({ orderBy: { ID: 'desc' } });
}

export async function createNews(data: {
    title: string;
    content: string;
    date: string;
}): Promise<NewsRow> {
    return webDb.news.create({ data });
}

export async function deleteNews(id: number): Promise<void> {
    await webDb.news.delete({ where: { ID: id } });
}

export async function getAllGiftCards(): Promise<GiftCardRow[]> {
    return webDb.giftcards.findMany({ orderBy: { ID: 'desc' } });
}

export async function getGiftCardByCode(code: string): Promise<GiftCardRow | null> {
    return webDb.giftcards.findFirst({ where: { code } });
}

export async function createGiftCard(data: {
    code: string;
    planID: number;
    date: number;
}): Promise<GiftCardRow> {
    return webDb.giftcards.create({
        data: {
            code: data.code,
            planID: data.planID,
            date: data.date,
            claimedby: 0,
            dateClaimed: 0,
        },
    });
}

export async function redeemGiftCard(
    id: number,
    username: string,
    dateClaimed: number
): Promise<GiftCardRow> {
    return webDb.giftcards.update({
        where: { ID: id },
        data: { user: username, dateClaimed },
    });
}

export async function getAllServers(): Promise<ServerRow[]> {
    return webDb.api.findMany({ orderBy: { name: 'asc' } });
}

export async function getAllMethods(): Promise<MethodRow[]> {
    return webDb.methods.findMany({ orderBy: { name: 'asc' } });
}

export async function getAllPayments(): Promise<PaymentRow[]> {
    return webDb.payments.findMany({ orderBy: { ID: 'desc' } });
}

export async function getTotalRevenue(): Promise<number> {
    const result = await webDb.payments.aggregate({ _sum: { paid: true } });
    return result._sum.paid ?? 0;
}
