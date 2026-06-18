'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageWithFallback from '@/components/ImageWithFallback';
import type { TLConfig } from '@/lib/tl-config';

interface ToolData {
  id: number;
  techname: string;
  tl1_desc: string;
  tl2_desc: string;
  tl3_desc: string;
  tl4_desc: string;
  link: string;
  displaytext: string;
  tags: Record<string, boolean>;
}

interface Props {
  config: TLConfig;
  checked: boolean[];
  toolsWithTags: ToolData[];
  tl: string;
}

type ToolWithIndex = ToolData & Record<string, unknown>;

export default function TLPageClient({
  config,
  checked,
  toolsWithTags,
  tl,
}: Props) {
  // Scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const btn = document.getElementById('topbutton');
      const bar = document.getElementById('bar');
      if (btn && bar) {
        btn.style.display =
          document.body.scrollTop > bar.offsetTop ||
          document.documentElement.scrollTop > bar.offsetTop
            ? 'block'
            : 'none';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter tools: a tool is shown if ANY checked strand tag is true
  const filtered = toolsWithTags.filter((tool) =>
    config.strands.some(
      (strand, i) => checked[i] && tool.tags[strand.domainColumn] === true,
    ),
  );

  return (
    <>
      <Navbar />
      <div id="subhead">
        <h1 id="test">{config.title}</h1>
        <h3>Filter by strand:</h3>
        <form className="filters" method="get" action={`/${tl}`}>
          {config.strands.map((strand, i) => (
            <div className="label" key={strand.checkboxName}>
              {/* Hidden input always sends "0" for unchecked state */}
              <input
                type="hidden"
                name={strand.checkboxName}
                value="0"
              />
              <span className={strand.cssClass}>
                {strand.label}{' '}
                <input
                  type="checkbox"
                  name={strand.checkboxName}
                  className="checkf"
                  value="1"
                  defaultChecked={checked[i]}
                  onChange={(e) => {
                    e.target.form?.submit();
                  }}
                />
              </span>
              <div className="overlay">{strand.tooltip}</div>
            </div>
          ))}
        </form>
      </div>
      <div id="bar">&nbsp;</div>
      <div id="all">
        <br />
        <div className="techtip-wrap">
          {filtered.length === 0 ? (
            <div>
              <h4>No results here match your filters.</h4>
            </div>
          ) : (
            filtered.map((tool, i) => (
              <div className="techtip" id={`${i}`} key={tool.id}>
                <div className="line" id={`${tool.id}`}></div>
                <h3 className="name">{tool.techname}</h3>
                <div className="tags">
                  {config.strands.map((strand) =>
                    tool.tags[strand.domainColumn] ? (
                      <span key={strand.cssClass} className={strand.cssClass}>
                        {strand.label}
                      </span>
                    ) : null,
                  )}
                </div>
                <div className="info">
                  <div className="img">
                    <ImageWithFallback
                      src={`/testuploads/${tool.id}.png`}
                      alt={tool.techname}
                    />
                  </div>
                  <div className="desc">
                    {(tool as ToolWithIndex)[`${tl}_desc`] as string}
                  </div>
                  <div className="link">
                    <ul>
                      <li>
                        <a href={tool.link} target="_blank" rel="noreferrer">
                          {tool.displaytext}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <br />
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        id="topbutton"
        title="Go to top"
      >
        Top
      </button>
      <Footer />
    </>
  );
}