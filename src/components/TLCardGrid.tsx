import Link from "next/link";

export default function TLCardGrid() {
  return (
    <>
      <div className="tl-section">
        <Link href="/tl1"><div className="tlx">
          <div className="tlhead">TL1: Knowing Our Students</div>
          <ul>
            <li style={{ listStyle: "none" }}><i>Includes the strands:</i></li><br />
            <li>Relationships</li>
            <li>Teacher planning</li>
            <li>Modify their teaching</li>
            <li>Achieve readiness</li>
          </ul>
        </div></Link>
        <Link href="/tl2"><div className="tlx">
          <div className="tlhead">TL2: Strategies for Learning</div>
          <ul>
            <li style={{ listStyle: "none" }}><i>Includes the strands:</i></li><br />
            <li>Understanding</li>
            <li>Multi-dimensional learning</li>
            <li>Reasoned arguments</li>
            <li>Repertoire of techniques</li>
            <li>Learning spaces</li>
          </ul>
        </div></Link>
        <Link href="/tl3"><div className="tlx">
          <div className="tlhead">TL3: Evidence for Learning</div>
          <ul>
            <li style={{ listStyle: "none" }}><i>Includes the strands:</i></li><br />
            <li>Reflect on thinking</li>
            <li>Evidence of student learning</li>
            <li>Employ feedback</li>
          </ul>
        </div></Link>
        <Link href="/tl4"><div className="tlx">
          <div className="tlhead">TL4: Crafting the Curriculum</div>
          <ul>
            <li style={{ listStyle: "none" }}><i>Includes the strands:</i></li><br />
            <li>Risk-taking environment</li>
            <li>Deepening lines of inquiry</li>
            <li>Responsibility and aspects of citizenship</li>
          </ul>
        </div></Link>
      </div>
      <p>In addition, if you know of any tech tools not already on this site, you may submit them here: <Link href="/submission"><button className="submit-link">Submit New Tech Tool</button></Link></p>
    </>
  );
}