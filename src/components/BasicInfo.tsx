import Link from 'next/link';

export default function BasicInfo() {
    return (
        <div id="all" style={{ padding: '0px 0px' }}>
            <div id="basicinfo">
                <h2 id="about" className="section-anchor">
                    About this site
                </h2>
                <p>
                    Before you start using this site, you&apos;ll want to take a moment to
                    understand how it is organized.{' '}
                </p>
                <p>
                    This website presents technological tools you can use to aid your instruction.
                    These <b>Tech Tools</b> are sorted into four <b>domains</b> based on their
                    function (see below). Within each domain, Tech Tools are then sorted into{' '}
                    <b>strands</b> based on how they help you accomplish each step in implementing
                    the broader educational strategy. On this site, there will be a separate page
                    for domain, where you will then be able to apply an interactive filter to find
                    tools specific to each strand.
                </p>
                <h1 id="strategies">The 4 Strategies for Teaching and Learning (TL):</h1>
                <p id="jump-menu" className="jump-menu">
                    Jump to: <Link href="/#tl1">TL1: Knowing</Link>
                    {' · '}
                    <Link href="/#tl2">TL2: Strategies</Link>
                    {' · '}
                    <Link href="/#tl3">TL3: Evidence</Link>
                    {' · '}
                    <Link href="/#tl4">TL4: Crafting</Link>
                    {' · '}
                    <Link href="/#submit-cta">Submit a Tool</Link>
                    {' · '}
                    <Link href="/#footer">Footer</Link>
                </p>
            </div>
        </div>
    );
}
