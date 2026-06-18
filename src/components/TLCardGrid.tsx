import Link from 'next/link';

interface CardProps {
  href: string;
  title: string;
  strands: string[];
}

function TLCard({ href, title, strands }: CardProps): React.ReactElement {
  return (
    <Link href={href} className="tlx">
      <div className="tlhead">{title}</div>
      <div className="tlx__strands-label">Includes the strands</div>
      <ul className="tlx__strands">
        {strands.map(s => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </Link>
  );
}

export default function TLCardGrid(): React.ReactElement {
  return (
    <>
      <div className="tl-section">
        <TLCard
          href="/tl1"
          title="TL1: Knowing Our Students"
          strands={[
            'Relationships',
            'Teacher planning',
            'Modify their teaching',
            'Achieve readiness',
          ]}
        />
        <TLCard
          href="/tl2"
          title="TL2: Strategies for Learning"
          strands={[
            'Understanding',
            'Multi-dimensional learning',
            'Reasoned arguments',
            'Repertoire of techniques',
            'Learning spaces',
          ]}
        />
        <TLCard
          href="/tl3"
          title="TL3: Evidence for Learning"
          strands={[
            'Reflect on thinking',
            'Evidence of student learning',
            'Employ feedback',
          ]}
        />
        <TLCard
          href="/tl4"
          title="TL4: Crafting the Curriculum"
          strands={[
            'Risk-taking environment',
            'Deepening lines of inquiry',
            'Responsibility and aspects of citizenship',
          ]}
        />
      </div>
      <p className="tl-submit-cta">
        In addition, if you know of any tech tools not already on this site, you may submit them here:{' '}
        <Link href="/submission">
          <button className="submit-link">Submit New Tech Tool</button>
        </Link>
      </p>
    </>
  );
}
