'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '@/app/form.css';

// Domain categories
const tl1Domains = [
  { name: 'R', label: 'Relationships' },
  { name: 'TP', label: 'Teacher Planning' },
  { name: 'MT', label: 'Modify their Teaching' },
  { name: 'AR', label: 'Achieve Readiness' },
];

const tl2Domains = [
  { name: 'U', label: 'Understanding' },
  { name: 'MDL', label: 'Multi-dimensional Learning' },
  { name: 'RA', label: 'Reasoned Arguments' },
  { name: 'RoTech', label: 'Lifelong Learning*' },
  { name: 'LS', label: 'Learning Spaces' },
];

const tl3Domains = [
  { name: 'RoThink', label: 'Reflect on Thinking' },
  { name: 'EoST', label: 'Evidence of Student Learning' },
  { name: 'EF', label: 'Employ Feedback' },
];

const tl4Domains = [
  { name: 'RTE', label: 'Risk-taking Environment' },
  { name: 'DLoI', label: 'Deepening Lines of Inquiry' },
  { name: 'RaAoC', label: 'Responsibility & Aspects of Citizenship' },
];

export default function SubmissionForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors([]);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const res = await fetch('/api/submission', {
        method: 'POST',
        body: formData,
      });
      
      if (res.redirected) {
        router.push('/');
        return;
      }
      
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || ['Submission failed']);
      } else {
        router.push('/');
      }
    } catch (err) {
      setErrors(['Network error. Please try again.']);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* submission form · richie-rich90454 · June 2026 */}
      <div id="subhead">
        <h1 id="submission-heading">Submit A New Tech Tool</h1>
        <p className="jump-menu">
          Jump to:{' '}
          <a href="#tool-name">Tool Name</a>
          {' · '}
          <a href="#tool-link">Link</a>
          {' · '}
          <a href="#descriptions">Descriptions</a>
          {' · '}
          <a href="#domains">Domains</a>
          {' · '}
          <a href="#screenshot">Screenshot</a>
          {' · '}
          <Link href="/#front">Home</Link>
        </p>
      </div>
      <div id="bar">&nbsp;</div>
      <div id="all">
        <br />
        {errors.length > 0 && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {errors.map((e, i) => <p key={i}>{e}</p>)}
          </div>
        )}
        <form action="/api/submission" method="post" encType="multipart/form-data" id="form" onSubmit={handleSubmit}>
          <h2>Tool Name:</h2>
          <input type="text" name="techname" className="l" placeholder="Name of Tool"/>
          
          <h2>Link:</h2>
          <input type="text" name="link" className="l" placeholder="Link"/>
          
          <h2>Display Text for Link:</h2>
          <input type="text" name="displaytext" className="l" placeholder="Display Text"/>
          
          <h2>TL1: Knowing Our Students Description:</h2>
          <textarea name="tl1_desc" className="l" form="form" placeholder="TL1 Description..."/>
          
          <h2>TL2: Strategies for Learning Description:</h2>
          <textarea name="tl2_desc" className="l" form="form" placeholder="TL2 Description..."/>
          
          <h2>TL3: Evidence for Learning Description:</h2>
          <textarea name="tl3_desc" className="l" form="form" placeholder="TL3 Description..."/>
          
          <h2>TL4: Crafting the Curriculum Description:</h2>
          <textarea name="tl4_desc" className="l" form="form" placeholder="TL4 Description..."/>
          
          <h2>TL1 Domains:</h2>
          <div className="domains">{tl1Domains.map(d => (
            <label key={d.name}><input type="checkbox" name={d.name} value="true"/>{d.label}</label>
          ))}</div>
          
          <h2>TL2 Domains:</h2>
          <div className="domains">{tl2Domains.map(d => (
            <label key={d.name}><input type="checkbox" name={d.name} value="true"/>{d.label}</label>
          ))}</div>
          
          <h2>TL3 Domains:</h2>
          <div className="domains">{tl3Domains.map(d => (
            <label key={d.name}><input type="checkbox" name={d.name} value="true"/>{d.label}</label>
          ))}</div>
          
          <h2>TL4 Domains:</h2>
          <div className="domains">{tl4Domains.map(d => (
            <label key={d.name}><input type="checkbox" name={d.name} value="true"/>{d.label}</label>
          ))}</div>
          
          <h2>Your Name (optional):</h2>
          <input type="text" name="username" className="l" placeholder="Your Name"/>
          
          <h2>Contact Email (optional):</h2>
          <input type="text" name="contact" className="l" placeholder="Contact Email"/>
          
          <h2>Upload screenshot:</h2>
          <input type="file" name="screenshot" accept="image/*"/>
          
          <input type="submit" value={submitting ? 'Submitting...' : 'Submit'} disabled={submitting} className="submit-btn"/>
        </form>
        <br />
      </div>
    </>
  );
}