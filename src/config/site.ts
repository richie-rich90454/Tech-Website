// Site-wide constants. Adjust here, propagate everywhere.

export const SITE = {
    name: 'BIBS·C Tech Tools',
    shortName: 'BIBS·C',
    description: 'A curated catalog of teaching technology tools, organized by domain and strand.',
    copyrightYear: 2026,
    author: 'BIBS·C Faculty',
} as const;

export const BRAND = {
    // The deep blue used on the topbar and submit button.
    primary: '#3255A4',
    primaryHover: '#78A9ff',
    // Accent gradient stops (replaces the old "rainbow" submit button).
    accentFrom: '#114ea8',
    accentTo: '#33b4df',
    // Soft paper background for content surfaces.
    surface: '#ffffff',
    ink: '#1f2937',
    muted: '#6b7280',
} as const;
