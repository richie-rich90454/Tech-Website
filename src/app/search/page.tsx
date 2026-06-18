import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageWithFallback from '@/components/ImageWithFallback';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import {
  getAcceptedSubmissions,
  getAllDomains,
} from '@/server/queries/submissions';
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

  const domTags = [
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

  function getActiveTags(tags: Record<string, boolean>): typeof domTags {
    return domTags.filter(dt => tags[dt.col]);
  }

  return (
    <>
      <Navbar />

      {!query.trim() ? (
        <>
          <div id="subhead">
            <h1>Search Tech Tools</h1>
          </div>
          <div id="bar">&nbsp;</div>
          <div id="all">
            <br />
            <div className="techtip-wrap">
              <div><h4>There is nothing here.</h4></div>
            </div>
            <br />
          </div>
        </>
      ) : (
        <>
          <div id="subhead">
            <h1>Results for: {query}</h1>
          </div>
          <div id="bar">&nbsp;</div>
          <div id="all">
            <br />
            <div className="techtip-wrap">
              {results.length === 0 ? (
                <div><h4>There is nothing here.</h4></div>
              ) : (
                results.map(({ item }, i) => {
                  const tags = getActiveTags(domainTags[item.id] || {});
                  const displayTags = tags.slice(0, 5);
                  const hiddenTags = tags.slice(5);
                  return (
                    <div className="techtip" id={`${i}`} key={item.id}>
                      <div className="line" id={`${item.id}`}></div>
                      <h3 className="name">{item.techname}</h3>
                      <div className="tags">
                        {displayTags.map(t => (
                          <Link key={t.col} href={`/${t.tl}#${t.col}`}>
                            <span className={t.css}>{t.label}</span>
                          </Link>
                        ))}
                        {hiddenTags.length > 0 && (
                          <span>and {hiddenTags.length} more...</span>
                        )}
                      </div>
                      <div className="info">
                        <div className="img">
                          <ImageWithFallback src={`/testuploads/${item.id}.png`} alt={item.techname} />
                        </div>
                        <div className="desc">
                          {item.tl1_desc && <p>TL1: {item.tl1_desc}</p>}
                          {item.tl2_desc && <p>TL2: {item.tl2_desc}</p>}
                          {item.tl3_desc && <p>TL3: {item.tl3_desc}</p>}
                          {item.tl4_desc && <p>TL4: {item.tl4_desc}</p>}
                          <div className="link">
                            <ul>
                              <li><a href={item.link} target="_blank">{item.displaytext}</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <br />
          </div>
        </>
      )}

      <ScrollToTopButton />
      <Footer />
    </>
  );
}
