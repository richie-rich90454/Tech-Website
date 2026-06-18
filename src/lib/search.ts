/**
 * FUSE SEARCH CONFIGURATION
 * — — — — — — — — — — — — —
 * Maintainer: richie-rich90454
 * Rewrite date: June 2026
 * "Search is the beginning of understanding." — Socrates (probably)
 */

import 'server-only';
import Fuse from 'fuse.js';
import { unstable_cache } from 'next/cache';
import { getAcceptedSubmissions } from '@/server/queries/submissions';

interface SearchItem {
  id: number;
  techname: string;
  tl1_desc: string;
  tl2_desc: string;
  tl3_desc: string;
  tl4_desc: string;
  link: string;
  displaytext: string;
}

const fuseOptions = {
  keys: ['techname', 'tl1_desc', 'tl2_desc', 'tl3_desc', 'tl4_desc', 'link', 'displaytext'],
  threshold: 0.4,
  includeScore: true,
};

export function buildFuse(items: SearchItem[]): Fuse<SearchItem> {
  return new Fuse(items, fuseOptions);
}

// Cached Fuse index — building it is O(n) and we re-build it on every page
// render otherwise. With the cache tag wired up, an admin submission edit
// will invalidate it automatically.
const getCachedFuse = unstable_cache(
  async (): Promise<Fuse<SearchItem>> => {
    const subs = await getAcceptedSubmissions();
    const items: SearchItem[] = subs.map((s) => ({
      id: s.id,
      techname: s.techname,
      tl1_desc: s.tl1_desc,
      tl2_desc: s.tl2_desc,
      tl3_desc: s.tl3_desc,
      tl4_desc: s.tl4_desc,
      link: s.link,
      displaytext: s.displaytext,
    }));
    return buildFuse(items);
  },
  ['fuse-index'],
  { revalidate: 3600, tags: ['submissions'] },
);

export async function getFuse(): Promise<Fuse<SearchItem>> {
  return getCachedFuse();
}
