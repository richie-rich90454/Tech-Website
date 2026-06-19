import 'server-only';
import { webDb } from '@/lib/db/web';
import type { TicketRow, MessageRow } from '@/types/db';

export interface CreateTicketInput {
    subject: string;
    content: string;
    status: string;
    username: string;
    date: number;
}

export interface CreateMessageInput {
    ticketid: number;
    content: string;
    sender: string;
    date: number;
}

export async function getAllTickets(
    options: {
        skip?: number;
        take?: number;
    } = {}
): Promise<TicketRow[]> {
    return webDb.tickets.findMany({
        orderBy: { id: 'desc' },
        skip: options.skip ?? 0,
        take: options.take ?? 50,
    });
}

export async function getTicketsByUser(username: string): Promise<TicketRow[]> {
    return webDb.tickets.findMany({ where: { username }, orderBy: { id: 'desc' } });
}

export async function getTicketById(id: number): Promise<TicketRow | null> {
    return webDb.tickets.findUnique({ where: { id } });
}

export async function createTicket(data: CreateTicketInput): Promise<TicketRow> {
    return webDb.tickets.create({ data });
}

export async function updateTicketStatus(id: number, status: string): Promise<TicketRow> {
    return webDb.tickets.update({ where: { id }, data: { status } });
}

export async function deleteTicket(id: number): Promise<void> {
    await webDb.messages.deleteMany({ where: { ticketid: id } });
    await webDb.tickets.delete({ where: { id } });
}

export async function getMessagesByTicket(ticketId: number): Promise<MessageRow[]> {
    return webDb.messages.findMany({
        where: { ticketid: ticketId },
        orderBy: { date: 'asc' },
    });
}

export async function createMessage(data: CreateMessageInput): Promise<MessageRow> {
    return webDb.messages.create({ data });
}

export async function getWaitingTicketCount(): Promise<number> {
    return webDb.tickets.count({ where: { status: 'Waiting for admin response' } });
}
