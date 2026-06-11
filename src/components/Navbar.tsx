import Link from "next/link";

export default function Navbar() {
  return (
    <div id="cover">
      {/* nav · richie-rich90454 · 2026/06 */}
      <div id="topbar">
        <h1>BIBS·C Tech Tools</h1>
      </div>
      <div id="navbar">
        <ul id="nav">
          <Link href="/"><li>Home</li><div className="underline"></div></Link>
          <Link href="/tl1"><li>Knowing (TL1)</li><div className="underline"></div></Link>
          <Link href="/tl2"><li>Strategies (TL2)</li><div className="underline"></div></Link>
          <Link href="/tl3"><li>Evidence (TL3)</li><div className="underline"></div></Link>
          <Link href="/tl4"><li>Crafting (TL4)</li><div className="underline"></div></Link>
        </ul>
      </div>
    </div>
  );
}