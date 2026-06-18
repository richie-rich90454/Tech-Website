import Link from 'next/link';

export default function Footer(): React.ReactElement {
  return (
    <footer id="footer" data-built-by="richie-rich90454">
      {/* built by richie-rich90454 · June 2026 */}
      <p id="footer-nav">
        <Link href="/tl1">Knowing (TL1)</Link>
        {' · '}
        <Link href="/tl2">Strategies (TL2)</Link>
        {' · '}
        <Link href="/tl3">Evidence (TL3)</Link>
        {' · '}
        <Link href="/tl4">Crafting (TL4)</Link>
        {' · '}
        <Link href="/search">Search</Link>
      </p>
      <p id="footer-copy">
        <b>&copy; 2026 BIBS&middot;C Tech Tips</b>
      </p>
    </footer>
  );
}
