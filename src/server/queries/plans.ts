import 'server-only';
import { webDb } from '@/lib/db/web';
import type { PlanRow } from '@/types/db';

export interface CreatePlanInput {
    name: string;
    vip: number;
    mbt: number;
    unit: string;
    length: number;
    price: number;
    concurrents: number;
    private: number;
}

export async function getAllPlans(): Promise<PlanRow[]> {
    return webDb.plans.findMany({ orderBy: { price: 'asc' } });
}

export async function getPlanById(id: number): Promise<PlanRow | null> {
    return webDb.plans.findUnique({ where: { ID: id } });
}

export async function createPlan(data: CreatePlanInput): Promise<PlanRow> {
    return webDb.plans.create({ data });
}

export async function updatePlan(id: number, data: Partial<CreatePlanInput>): Promise<PlanRow> {
    return webDb.plans.update({ where: { ID: id }, data });
}

export async function deletePlan(id: number): Promise<void> {
    await webDb.plans.delete({ where: { ID: id } });
}
