import Link from 'next/link';

export default function Navbar(): React.ReactElement {
  return (
    <div id="cover">
      {/* nav · richie-rich90454 · 2026/06 */}
      <div id="topbar">
        <h1>BIBS·C Tech Tools</h1>
      </div>
      <nav id="navbar" aria-label="Primary">
        <ul id="nav">
          <li>
            <Link href="/"><span>Home</span><span className="nav-underline" aria-hidden /></Link>
          </li>
          <li>
            <Link href="/tl1"><span>Knowing (TL1)</span><span className="nav-underline" aria-hidden /></Link>
          </li>
          <li>
            <Link href="/tl2"><span>Strategies (TL2)</span><span className="nav-underline" aria-hidden /></Link>
          </li>
          <li>
            <Link href="/tl3"><span>Evidence (TL3)</span><span className="nav-underline" aria-hidden /></Link>
          </li>
          <li>
            <Link href="/tl4"><span>Crafting (TL4)</span><span className="nav-underline" aria-hidden /></Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
