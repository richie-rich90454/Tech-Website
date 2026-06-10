import { webDb } from '@/lib/db/web';

export const dynamic = 'force-dynamic';

export default async function PlanPage() {
  const plans = await webDb.plans.findMany({
    where: { private: 0 },
    orderBy: { price: 'asc' },
  });

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Plans</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql" aria-current="page">IPstress</li>
                <li className="breadcrumb-item text-muted" aria-current="page">Plans</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          {plans.length === 0 ? (
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center">
                  <p className="text-muted">No plans available at this time.</p>
                </div>
              </div>
            </div>
          ) : (
            plans.map((plan) => (
              <div key={plan.ID} className="col-md-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h5 className="text-center text-uppercase mt-3 mb-4">{plan.name}</h5>
                    <h3 className="text-center font-weight-light">{plan.price}¥</h3>
                    <p className="text-muted text-center mb-4 font-weight-light">
                      Duration: {plan.length} day{plan.length !== 1 ? 's' : ''}
                    </p>
                    <div className="d-flex align-items-center mb-2">
                      <p><i className="fa fa-minus" aria-hidden="true"></i> Max Attack Time: <b>{plan.mbt}s</b></p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <p><i className="fa fa-minus" aria-hidden="true"></i> Concurrents: <b>{plan.concurrents}</b></p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <p><i className="fa fa-minus" aria-hidden="true"></i> <b>Unlimited Attacks</b></p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <p>
                        <i className="fa fa-minus" aria-hidden="true"></i>{' '}
                        {plan.vip ? (
                          <>VIP: <span style={{ color: '#22ca80', fontWeight: 'bold' }} className="fa fa-check"></span></>
                        ) : (
                          <>VIP: <span style={{ color: '#da4453', fontWeight: 'bold' }} className="fa fa-times"></span></>
                        )}
                      </p>
                    </div>
                    <a className="link-effect" href="https://t.me/UsdtNL_bot" target="_blank" rel="noopener noreferrer">
                      <button className="btn btn-success btn-border btn-lg w-100 fw-bold mb-3" type="button">
                        Buy Now
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}