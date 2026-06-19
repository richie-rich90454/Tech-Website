// Single import surface for TL configuration.
// Re-exports from src/lib/tl-config.ts so feature code only depends on @/config/tl.

import { tlConfigs, type TLConfig } from '@/lib/tl-config';

export { tlConfigs, type TLConfig, type StrandConfig } from '@/lib/tl-config';

export function getTlConfig(id: string): TLConfig | null {
    return tlConfigs[id] ?? null;
}

export function isValidTl(id: string): boolean {
    return id in tlConfigs;
}

export type TlKey = keyof typeof tlConfigs;
