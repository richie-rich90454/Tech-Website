'use client';

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
  accepted: boolean;
  username: string;
  contact: string;
};

type Domain = Record<string, boolean | number> & { id: number };

export default function AdminTable({
  subs,
  domainMap,
}: {
  subs: Submission[];
  domainMap: Map<number, Domain>;
}) {
  const router = useRouter();

  async function action(url: string, body: Record<string, unknown>) {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* admin panel · rewired by richie-rich90454 · 2026/06 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1a237e', color: '#fff' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Link</th>
            <th>Display</th>
            <th>TL1 Desc</th>
            <th>TL2 Desc</th>
            <th>TL3 Desc</th>
            <th>TL4 Desc</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((sub, i) => {
            const bg = i % 2 === 0 ? '#e8eaf6' : '#fff';
            const color = '#000';
            return (
              <tr key={sub.id} style={{ background: bg, color }}>
                <td>{sub.id}</td>
                <td>{sub.techname}</td>
                <td>
                  <a href={sub.link} target="_blank" rel="noreferrer">
                    {sub.link}
                  </a>
                </td>
                <td>{sub.displaytext}</td>
                <td>{sub.tl1_desc?.slice(0, 100)}</td>
                <td>{sub.tl2_desc?.slice(0, 100)}</td>
                <td>{sub.tl3_desc?.slice(0, 100)}</td>
                <td>{sub.tl4_desc?.slice(0, 100)}</td>
                <td>{sub.accepted ? 'Accepted' : 'Pending'}</td>
                <td>
                  <button
                    onClick={() => action('/api/admin/accept', { id: sub.id })}
                    style={{ margin: 2 }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => action('/api/admin/reject', { id: sub.id })}
                    style={{ margin: 2 }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => router.push(`/admin/edit/${sub.id}`)}
                    style={{ margin: 2 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => action('/api/admin/delete', { id: sub.id })}
                    style={{ margin: 2, color: 'red' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}