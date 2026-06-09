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

  const styles = {
    wrapper: { padding: '20px', maxWidth: '1200px', margin: '0 auto' } as React.CSSProperties,
    table: { width: '100%', borderCollapse: 'collapse', background: '#fff', color: '#000' } as React.CSSProperties,
    th: { background: '#001d6c', color: '#fff', padding: '12px 8px', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px', textAlign: 'center' } as React.CSSProperties,
    td: { border: '1px solid #ddd', padding: '8px', verticalAlign: 'middle' } as React.CSSProperties,
    textarea: { width: '100%', minHeight: '80px', padding: '10px', border: '1px solid #1565c0', background: '#fff', color: '#000' } as React.CSSProperties,
    section: { marginTop: '20px' } as React.CSSProperties,
    h3: { color: '#1565c0' } as React.CSSProperties,
    checkboxList: { display: 'flex', flexWrap: 'wrap', gap: '10px 30px', listStyle: 'none', padding: '10px 0' } as React.CSSProperties,
    checkboxItem: { display: 'flex', alignItems: 'center', gap: '8px', color: '#000' } as React.CSSProperties,
    submitBtn: { backgroundColor: '#1565c0', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' } as React.CSSProperties,
  };

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tool ID</th>
              <th style={styles.th}>Tool Name</th>
              <th style={styles.th}>TL1 Description</th>
              <th style={styles.th}>TL2 Description</th>
              <th style={styles.th}>TL3 Description</th>
              <th style={styles.th}>TL4 Description</th>
              <th style={styles.th}>Link</th>
              <th style={styles.th}>Display Text</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>{submission.id}</td>
              <td style={styles.td}><textarea name="Techname" style={styles.textarea} defaultValue={submission.techname} /></td>
              <td style={styles.td}><textarea name="description" style={styles.textarea} defaultValue={submission.tl1_desc} /></td>
              <td style={styles.td}><textarea name="description2" style={styles.textarea} defaultValue={submission.tl2_desc} /></td>
              <td style={styles.td}><textarea name="description3" style={styles.textarea} defaultValue={submission.tl3_desc} /></td>
              <td style={styles.td}><textarea name="description4" style={styles.textarea} defaultValue={submission.tl4_desc} /></td>
              <td style={styles.td}><textarea name="Link" style={styles.textarea} defaultValue={submission.link} /></td>
              <td style={styles.td}><textarea name="display" style={styles.textarea} defaultValue={submission.displaytext} /></td>
            </tr>
          </tbody>
        </table>

        <div style={styles.section}>
          <h3 style={styles.h3}>Strands</h3>
          <ul style={styles.checkboxList}>
            {DOMAIN_FIELDS.map(({ key, label }) => (
              <li key={key} style={styles.checkboxItem}>
                <input type="checkbox" name={key} defaultChecked={domain ? !!domain[key] : false} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" style={styles.submitBtn} disabled={saving}>
          {saving ? 'Saving...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}