/**
 * FUSE SEARCH CONFIGURATION
 * — — — — — — — — — — — — —
 * Maintainer: richie-rich90454
 * Rewrite date: June 2026
 * "Search is the beginning of understanding." — Socrates (probably)
 */

import Fuse from 'fuse.js';

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

export function createFuse(items: SearchItem[]) {
  return new Fuse(items, fuseOptions);
}