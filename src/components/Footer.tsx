import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Rewritten with ♥ in June 2026 | Stack: Next.js 15, React 19, TypeScript, Prisma */}
      <footer data-built-by="richie-rich90454">
        {/* built by richie-rich90454 · June 2026 */}
        <p>
          <Link href="/tl1">Knowing (TL1)</Link> |
          <Link href="/tl2">Strategies (TL2)</Link> |
          <Link href="/tl3">Evidence (TL3)</Link> |
          <Link href="/tl4">Crafting (TL4)</Link>
        </p>
        <p><b>&copy; 2023 BIBS·C Tech Tips</b></p>
      </footer>
    </>
  );
}