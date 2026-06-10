import { webDb } from '@/lib/db/web';

async function getUserData(userId: number) {
  const user = await webDb.users.findUnique({
    where: { ID: userId },
    select: {
      ID: true,
      username: true,
      membership: true,
      expire: true,
      referral: true,
      referralbalance: true,
    },
  });
  if (!user) return null;

  let planName = 'No membership';
  let planMbt = 0;
  let planConcurrents = 0;

  if (user.membership && user.membership !== 0) {
    const plan = await webDb.plans.findUnique({
      where: { ID: user.membership },
      select: { name: true, mbt: true, concurrents: true },
    });
    if (plan) {
      planName = plan.name;
      planMbt = plan.mbt;
      planConcurrents = plan.concurrents;
    }
  }

  const expiryDate = user.expire && user.expire !== 0
    ? new Date(user.expire * 1000).toLocaleDateString('en-US')
    : 'No membership';

  return {
    id: user.ID,
    username: user.username,
    planName,
    planMbt,
    planConcurrents,
    expiryDate,
    referral: user.referral,
    referralBalance: user.referralbalance,
  };
}

export default async function ProfilePage() {
  // Default to user ID 1 for demo; in production this comes from session
  const userData = await getUserData(1);

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Profile</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql active" aria-current="page">IPstress</li>
                <li className="breadcrumb-item text-muted" aria-current="page">Profile</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          {/* User Info Card */}
          <div className="col-md-6 col-lg-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Account Info</h4>
                <div className="mt-4 activity">
                  {userData ? (
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>ID</td>
                            <td>{userData.id}</td>
                          </tr>
                          <tr>
                            <td>Username</td>
                            <td>{userData.username}</td>
                          </tr>
                          <tr>
                            <td>Membership</td>
                            <td>{userData.planName}</td>
                          </tr>
                          <tr>
                            <td>Max Attack Time</td>
                            <td>{userData.planMbt ? `${userData.planMbt}s` : 'No membership'}</td>
                          </tr>
                          <tr>
                            <td>Max Concurrents</td>
                            <td>{userData.planConcurrents || 'No membership'}</td>
                          </tr>
                          <tr>
                            <td>Expiry</td>
                            <td>{userData.expiryDate}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted">User data not available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Referral Card */}
          <div className="col-md-6 col-lg-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Referral</h4>
                <div className="mt-4 activity">
                  {userData ? (
                    <>
                      <div className="form-group">
                        <label className="text-white">Referral Link</label>
                        <input
                          className="form-control"
                          type="text"
                          readOnly
                          value={userData.referral ? `https://ipstress.com/register?ref=${userData.referral}` : 'N/A'}
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-white">Referral Balance</label>
                        <p className="text-white font-weight-medium">{userData.referralBalance}¥</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted">Referral data not available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Card */}
          <div className="col-md-6 col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Change Password</h4>
                <div className="mt-2 activity">
                  <div className="row">
                    <div className="col-lg-12">
                      <form method="post" action="/web/api/profile/password">
                        <div className="form-group">
                          <label className="text-white" htmlFor="old">Current Password</label>
                          <input className="form-control" id="old" name="old" type="password" required />
                        </div>
                        <div className="form-group">
                          <label className="text-white" htmlFor="new">New Password</label>
                          <input className="form-control" id="new" name="new" type="password" required />
                        </div>
                        <div className="form-group">
                          <label className="text-white" htmlFor="rnew">Repeat New Password</label>
                          <input className="form-control" id="rnew" name="rnew" type="password" required />
                        </div>
                        <div className="form-group">
                          <button name="update" value="change" type="submit" className="btn btn-primary">
                            Change Password
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}