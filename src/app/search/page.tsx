import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageWithFallback from '@/components/ImageWithFallback';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { getAcceptedSubmissions, getAllDomains } from '@/server/queries/submissions';
import { getFuse } from '@/lib/search';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{ query?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
    const sp = await searchParams;
    const query = (sp.query ?? '').trim();

    // Use the cached Fuse index instead of rebuilding it on every request.
    const fuse = await getFuse();
    const allSubs = await getAcceptedSubmissions();
    const searchTargets = allSubs.map((s) => ({
        id: s.id,
        techname: s.techname,
        tl1_desc: s.tl1_desc,
        tl2_desc: s.tl2_desc,
        tl3_desc: s.tl3_desc,
        tl4_desc: s.tl4_desc,
        link: s.link,
        displaytext: s.displaytext,
    }));

    let results: Array<{ item: (typeof searchTargets)[0]; score?: number }> = [];
    if (query) {
        results = fuse.search(query).map((r) => ({ item: r.item, score: r.score }));
    }

    const resultIds = results.map((r) => r.item.id);
    const allDomains = await getAllDomains();
    const domainTags: Record<number, Record<string, boolean>> = {};
    for (const d of allDomains) {
        if (resultIds.length === 0 || resultIds.includes(d.id)) {
            const { id, ...tags } = d as unknown as { id: number } & Record<string, boolean>;
            domainTags[id] = tags;
        }
    }

    // Build the list of tag pills displayed under each result, in the same
    // fixed order the strand navigation uses, so lookups are O(1).
    const domTags: ReadonlyArray<{ col: string; label: string; tl: string; css: string }> = [
        { col: 'R', label: 'Relationships', tl: 'tl1', css: 'n1' },
        { col: 'TP', label: 'Teacher Planning', tl: 'tl1', css: 'n2' },
        { col: 'MT', label: 'Modify Teaching', tl: 'tl1', css: 'n3' },
        { col: 'AR', label: 'Achieve Readiness', tl: 'tl1', css: 'n4' },
        { col: 'U', label: 'Understanding', tl: 'tl2', css: 'n1' },
        { col: 'MDL', label: 'Multi-dimensional', tl: 'tl2', css: 'n2' },
        { col: 'RA', label: 'Reasoned Arguments', tl: 'tl2', css: 'n3' },
        { col: 'RoTech', label: 'Repertoire', tl: 'tl2', css: 'n4' },
        { col: 'LS', label: 'Learning Spaces', tl: 'tl2', css: 'n5' },
        { col: 'RoThink', label: 'Reflect on Thinking', tl: 'tl3', css: 'n1' },
        { col: 'EoST', label: 'Evidence of Learning', tl: 'tl3', css: 'n2' },
        { col: 'EF', label: 'Employ Feedback', tl: 'tl3', css: 'n3' },
        { col: 'RTE', label: 'Risk-taking', tl: 'tl4', css: 'n1' },
        { col: 'DLoI', label: 'Deepening Inquiry', tl: 'tl4', css: 'n2' },
        { col: 'RaAoC', label: 'Responsibility', tl: 'tl4', css: 'n3' },
    ];

    function getActiveTags(tags: Record<string, boolean>) {
        return domTags.filter((dt) => tags[dt.col]);
    }

    return (
        <>
            <Navbar />

            <div id="search" />
            <div id="subhead">
                <h1 id="search-results">{query ? `Results for: ${query}` : 'Search Tech Tools'}</h1>
                <form id="search-form" method="get" action="/search" className="search-form">
                    <input
                        type="text"
                        name="query"
                        id="search-input"
                        defaultValue={query}
                        placeholder="Search tech tools by name, description, or tag…"
                        aria-label="Search tech tools"
                    />
                    <button type="submit" id="search-submit">
                        Search
                    </button>
                </form>
                {query && (
                    <p className="search-meta">
                        {results.length} {results.length === 1 ? 'result' : 'results'}
                    </p>
                )}
                <p className="jump-menu">
                    Jump to: <a href="#search-results">Results</a>
                    {query && results.length > 0 && (
                        <>
                            {' · '}
                            {results.slice(0, 5).map(({ item }, i) => (
                                <span key={item.id}>
                                    {i > 0 && ' · '}
                                    <a href={`#tool-${item.id}`}>{item.techname}</a>
                                </span>
                            ))}
                        </>
                    )}
                    {' · '}
                    <Link href="/#front">Home</Link>
                </p>
            </div>
            <div id="bar">&nbsp;</div>
            <div id="all">
                <div className="techtip-wrap" id="results">
                    {!query ? (
                        <div>
                            <h4>Type a search term above to look up a tool.</h4>
                        </div>
                    ) : results.length === 0 ? (
                        <div>
                            <h4>No tools match &ldquo;{query}&rdquo;.</h4>
                        </div>
                    ) : (
                        results.map(({ item }) => {
                            const tags = getActiveTags(domainTags[item.id] ?? {});
                            const displayTags = tags.slice(0, 5);
                            const hiddenTags = tags.slice(5);
                            return (
                                <div className="techtip" id={`tool-${item.id}`} key={item.id}>
                                    <div className="line" id={`line-${item.id}`}></div>
                                    <h3 className="name">{item.techname}</h3>
                                    <div className="tags">
                                        {displayTags.map((t) => (
                                            <Link key={t.col} href={`/${t.tl}#${t.col}`}>
                                                <span className={t.css}>{t.label}</span>
                                            </Link>
                                        ))}
                                        {hiddenTags.length > 0 && (
                                            <span className="tags-more">
                                                and {hiddenTags.length} more&hellip;
                                            </span>
                                        )}
                                    </div>
                                    <div className="info">
                                        <div className="img">
                                            <ImageWithFallback
                                                src={`/testuploads/${item.id}.png`}
                                                alt={item.techname}
                                            />
                                        </div>
                                        <div className="desc">
                                            {item.tl1_desc && (
                                                <p>
                                                    <b>TL1:</b> {item.tl1_desc}
                                                </p>
                                            )}
                                            {item.tl2_desc && (
                                                <p>
                                                    <b>TL2:</b> {item.tl2_desc}
                                                </p>
                                            )}
                                            {item.tl3_desc && (
                                                <p>
                                                    <b>TL3:</b> {item.tl3_desc}
                                                </p>
                                            )}
                                            {item.tl4_desc && (
                                                <p>
                                                    <b>TL4:</b> {item.tl4_desc}
                                                </p>
                                            )}
                                            <div className="link">
                                                <ul>
                                                    <li>
                                                        <a
                                                            href={item.link}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {item.displaytext}
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <ScrollToTopButton />
            <Footer />
        </>
    );
}
