import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const now = Math.floor(Date.now() / 1000);

    const [
        totalUsers,
        activeUsers,
        totalAttacks,
        runningAttacks,
        totalRevenue,
        vipUsers,
        bannedUsers,
        waitingTickets,
    ] = await Promise.all([
        webDb.users.count(),
        webDb.users.count({ where: { membership: { not: 0 } } }),
        webDb.logs.count(),
        webDb.logs.count({
            where: { stopped: 0, date: { lte: now }, time: { not: 0 } },
        }),
        webDb.payments.aggregate({ _sum: { paid: true } }),
        webDb.users.count({ where: { rank: { gt: 0 } } }),
        webDb.users.count({ where: { status: 1 } }),
        webDb.tickets.count({ where: { status: 'Waiting for admin response' } }),
    ]);

    const revenue = totalRevenue._sum.paid || 0;

    const stats = [
        { label: 'Total Users', value: totalUsers, icon: 'user-plus', color: 'purple' },
        { label: 'Active Users', value: activeUsers, icon: 'user-check', color: 'success' },
        { label: 'Total Attacks', value: totalAttacks, icon: 'x-circle', color: 'danger' },
        { label: 'Running Attacks', value: runningAttacks, icon: 'activity', color: 'warning' },
        {
            label: 'Total Revenue',
            value: `$${revenue.toFixed(2)}`,
            icon: 'dollar-sign',
            color: 'info',
        },
        { label: 'VIP Users', value: vipUsers, icon: 'star', color: 'primary' },
        { label: 'Banned Users', value: bannedUsers, icon: 'slash', color: 'dark' },
        { label: 'Waiting Tickets', value: waitingTickets, icon: 'mail', color: 'orange' },
    ];

    const icons: Record<string, string> = {
        'user-plus':
            '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>',
        'user-check':
            '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>',
        'x-circle':
            '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>',
        activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
        'dollar-sign':
            '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
        star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
        slash: '<circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>',
        mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
    };

    return (
        <>
            <div className="page-breadcrumb">
                <div className="d-flex align-items-center">
                    <h4 className="page-title text-truncate text-white font-weight-medium mb-0">
                        Admin Dashboard
                    </h4>
                    <div className="ml-auto">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb m-0 p-0">
                                <li className="breadcrumb-item text-sql">IPstress</li>
                                <li className="breadcrumb-item text-muted">Admin Dashboard</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="container-fluid">
                <div className="card-group">
                    {stats.map((s, i) => (
                        <div
                            key={s.label}
                            className={`card${i < stats.length - 1 ? ' border-right' : ''}`}
                        >
                            <div className="card-body">
                                <div className="d-flex d-lg-flex d-md-block align-items-center">
                                    <div>
                                        <div className="d-inline-flex align-items-center">
                                            <h2 className="text-white mb-1 font-weight-medium">
                                                {s.value}
                                            </h2>
                                        </div>
                                        <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate mb-2">
                                            {s.label}
                                        </h6>
                                    </div>
                                    <div className="ml-auto mt-md-3 mt-lg-0">
                                        <span className="opacity-7 text-muted">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                dangerouslySetInnerHTML={{
                                                    __html: icons[s.icon] || '',
                                                }}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
