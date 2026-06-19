import { webDb } from '@/lib/db/web';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminEditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) return notFound();

    const [user, plans] = await Promise.all([
        webDb.users.findUnique({
            where: { ID: userId },
            select: {
                ID: true,
                username: true,
                rank: true,
                membership: true,
                expire: true,
                status: true,
                referralbalance: true,
                testattack: true,
            },
        }),
        webDb.plans.findMany({ select: { ID: true, name: true }, orderBy: { ID: 'asc' } }),
    ]);

    if (!user) return notFound();

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Edit User
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql">IPstress</li>
                                <li className="breadcrumb-item text-muted">
                                    <a href="/web/admin/users">Users</a>
                                </li>
                                <li className="breadcrumb-item text-muted">{user.username}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-8 col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Edit: {user.username}</h4>
                                <form method="POST" action="/web/api/admin/users" className="mt-4">
                                    <input type="hidden" name="id" value={user.ID} />
                                    <input type="hidden" name="action" value="update" />

                                    <div className="form-group">
                                        <label className="text-white">Username</label>
                                        <input
                                            className="form-control"
                                            name="username"
                                            defaultValue={user.username}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">
                                            New Password (leave blank to keep)
                                        </label>
                                        <input
                                            className="form-control"
                                            name="password"
                                            type="password"
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Rank</label>
                                        <select
                                            className="form-control"
                                            name="rank"
                                            defaultValue={user.rank}
                                        >
                                            <option value="0">User</option>
                                            <option value="1">Admin</option>
                                            <option value="2">Super Admin</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Membership</label>
                                        <select
                                            className="form-control"
                                            name="membership"
                                            defaultValue={user.membership}
                                        >
                                            <option value="0">None</option>
                                            {plans.map((p) => (
                                                <option key={p.ID} value={p.ID}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">
                                            Expire (Unix timestamp)
                                        </label>
                                        <input
                                            className="form-control"
                                            name="expire"
                                            type="number"
                                            defaultValue={user.expire}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Status</label>
                                        <select
                                            className="form-control"
                                            name="status"
                                            defaultValue={user.status}
                                        >
                                            <option value="0">Active</option>
                                            <option value="1">Banned</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Test Attack Remaining</label>
                                        <input
                                            className="form-control"
                                            name="testattack"
                                            type="number"
                                            defaultValue={user.testattack}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="text-white">Referral Balance</label>
                                        <input
                                            className="form-control"
                                            name="referralbalance"
                                            type="number"
                                            defaultValue={user.referralbalance}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                    <a href="/web/admin/users" className="btn btn-secondary ml-2">
                                        Cancel
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
