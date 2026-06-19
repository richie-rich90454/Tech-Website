'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Submission = {
  id: number;
  techname: string;
  link: string;
  displaytext: string;
  tl1_desc: string;
  tl2_desc: string;
  tl3_desc: string;
  tl4_desc: string;
};

type Domain = {
  id: number;
  R: boolean;
  TP: boolean;
  MT: boolean;
  AR: boolean;
  U: boolean;
  MDL: boolean;
  RA: boolean;
  RoTech: boolean;
  LS: boolean;
  RoThink: boolean;
  EoST: boolean;
  EF: boolean;
  RTE: boolean;
  DLoI: boolean;
  RaAoC: boolean;
} | null;

const DOMAIN_FIELDS = [
  { key: 'R', label: 'Relationship' },
  { key: 'TP', label: 'Teacher Planning' },
  { key: 'MT', label: 'Modify Their Teaching' },
  { key: 'AR', label: 'Achieve Readiness' },
  { key: 'U', label: 'Understanding' },
  { key: 'MDL', label: 'Multi-Dimensional Learning' },
  { key: 'RA', label: 'Reasoned Arguments' },
  { key: 'RoTech', label: 'Repertoire of Techniques' },
  { key: 'LS', label: 'Learning Spaces' },
  { key: 'RoThink', label: 'Reflect on Thinking' },
  { key: 'EoST', label: 'Evidence of Student Learning' },
  { key: 'EF', label: 'Employ Feedback' },
  { key: 'RTE', label: 'Risk Taking Environment' },
  { key: 'DLoI', label: 'Deepening Lines of Inquiry' },
  { key: 'RaAoC', label: 'Responsibility and Aspects of Citizenship' },
] as const;

export default function EditForm({
  submission,
  domain,
}: {
  submission: Submission;
  domain: Domain;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body: Record<string, unknown> = {
      id1: submission.id,
      Techname: formData.get('Techname'),
      description: formData.get('description'),
      description2: formData.get('description2'),
      description3: formData.get('description3'),
      description4: formData.get('description4'),
      Link: formData.get('Link'),
      display: formData.get('display'),
    };

    for (const field of DOMAIN_FIELDS) {
      body[field.key] = formData.get(field.key) === 'on';
    }

    const res = await fetch('/api/admin/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setSaving(false);
    }
  }

  // The visual skin lives in globals.css (#wrap table / #wrap table th /
  // #wrap table td / #wrap table textarea / #wrap h3 / #wrap ul li / etc) so
  // it stays in step with the rest of the design system.
  return (
    <form onSubmit={handleSubmit}>
      <table>
        <thead>
          <tr>
            <th>Tool ID</th>
            <th>Tool Name</th>
            <th>TL1 Description</th>
            <th>TL2 Description</th>
            <th>TL3 Description</th>
            <th>TL4 Description</th>
            <th>Link</th>
            <th>Display Text</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{submission.id}</td>
            <td><textarea name="Techname" defaultValue={submission.techname} /></td>
            <td><textarea name="description" defaultValue={submission.tl1_desc} /></td>
            <td><textarea name="description2" defaultValue={submission.tl2_desc} /></td>
            <td><textarea name="description3" defaultValue={submission.tl3_desc} /></td>
            <td><textarea name="description4" defaultValue={submission.tl4_desc} /></td>
            <td><textarea name="Link" defaultValue={submission.link} /></td>
            <td><textarea name="display" defaultValue={submission.displaytext} /></td>
          </tr>
        </tbody>
      </table>

      <h3>Strands</h3>
      <ul>
        {DOMAIN_FIELDS.map(({ key, label }) => (
          <li key={key}>
            <input type="checkbox" name={key} defaultChecked={domain ? !!domain[key] : false} />
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Submit'}
      </button>
    </form>
  );
}