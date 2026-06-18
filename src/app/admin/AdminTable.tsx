'use client';

import { useRouter } from 'next/navigation';
import styles from './AdminTable.module.css';

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
  domainMap: _domainMap,
}: {
  subs: Submission[];
  domainMap: Map<number, Domain>;
}): React.ReactElement {
  const router = useRouter();

  async function action(url: string, body: Record<string, unknown>): Promise<void> {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  return (
    <div className={styles.wrap}>
      {/* admin panel · rewired by richie-rich90454 · 2026/06 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Link</th>
            <th>Display</th>
            <th>TL1</th>
            <th>TL2</th>
            <th>TL3</th>
            <th>TL4</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subs.map(sub => (
            <tr key={sub.id}>
              <td className={styles.mono}>{sub.id}</td>
              <td className={styles.name}>{sub.techname}</td>
              <td>
                <a href={sub.link} target="_blank" rel="noreferrer" className={styles.link}>
                  {sub.link}
                </a>
              </td>
              <td>{sub.displaytext}</td>
              <td className={styles.desc}>{sub.tl1_desc?.slice(0, 90)}</td>
              <td className={styles.desc}>{sub.tl2_desc?.slice(0, 90)}</td>
              <td className={styles.desc}>{sub.tl3_desc?.slice(0, 90)}</td>
              <td className={styles.desc}>{sub.tl4_desc?.slice(0, 90)}</td>
              <td>
                <span
                  className={sub.accepted ? styles.badgeOk : styles.badgePending}
                >
                  {sub.accepted ? 'Accepted' : 'Pending'}
                </span>
              </td>
              <td className={styles.actions}>
                {!sub.accepted && (
                  <button
                    type="button"
                    onClick={() => action('/api/admin/accept', { id: sub.id })}
                    className={styles.btnAccept}
                  >
                    Accept
                  </button>
                )}
                {sub.accepted && (
                  <button
                    type="button"
                    onClick={() => action('/api/admin/reject', { id: sub.id })}
                    className={styles.btnReject}
                  >
                    Reject
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => router.push(`/admin/edit/${sub.id}`)}
                  className={styles.btnEdit}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => action('/api/admin/delete', { id: sub.id })}
                  className={styles.btnDelete}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
