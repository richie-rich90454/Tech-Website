import { webDb } from '@/lib/db/web';

export default async function AdminSettingsPage() {
  const [settings, smtp] = await Promise.all([
    webDb.settings.findFirst(),
    webDb.smtpsettings.findFirst(),
  ]);

  return (
    <>
      <div className="page-breadcrumb">
        <div className="d-flex align-items-center">
          <h4 className="page-title text-truncate text-white font-weight-medium mb-0">Settings</h4>
          <div className="ml-auto">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb m-0 p-0">
                <li className="breadcrumb-item text-sql">IPstress</li>
                <li className="breadcrumb-item text-muted">Settings</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          {/* General Settings */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">General Settings</h4>
                <form method="POST" action="/web/api/admin/settings" className="mt-4">
                  <input type="hidden" name="action" value="update" />
                  <div className="form-group">
                    <label className="text-white">Site Name</label>
                    <input className="form-control" name="sitename" defaultValue={settings?.sitename || ''} required />
                  </div>
                  <div className="form-group">
                    <label className="text-white">URL</label>
                    <input className="form-control" name="url" defaultValue={settings?.url || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Description</label>
                    <textarea className="form-control" name="description" rows={3} defaultValue={settings?.description || ''}></textarea>
                  </div>
                  <div className="form-group">
                    <label className="text-white">Cooldown</label>
                    <input className="form-control" name="cooldown" type="number" defaultValue={settings?.cooldown || 0} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Cooldown Time (seconds)</label>
                    <input className="form-control" name="cooldownTime" type="number" defaultValue={settings?.cooldownTime || 0} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Max Attacks Per User</label>
                    <input className="form-control" name="maxattacks" type="number" defaultValue={settings?.maxattacks || 0} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Test Boots</label>
                    <input className="form-control" name="testboots" type="number" defaultValue={settings?.testboots || 0} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Maintenance Mode</label>
                    <select className="form-control" name="maintaince" defaultValue={settings?.maintaince || ''}>
                      <option value="">Off</option>
                      <option value="1">On</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="text-white">Rotation</label>
                    <select className="form-control" name="rotation" defaultValue={String(settings?.rotation || 0)}>
                      <option value="0">Off</option>
                      <option value="1">On</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Save General Settings</button>
                </form>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Payment Settings</h4>
                <form method="POST" action="/web/api/admin/settings" className="mt-4">
                  <input type="hidden" name="action" value="update" />
                  <div className="form-group">
                    <label className="text-white">PayPal Email</label>
                    <input className="form-control" name="paypal" defaultValue={settings?.paypal || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">PayPal (on/off)</label>
                    <select className="form-control" name="paypal_email" defaultValue={settings?.paypal_email || ''}>
                      <option value="">Off</option>
                      <option value="on">On</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="text-white">Bitcoin Address</label>
                    <input className="form-control" name="bitcoin" defaultValue={settings?.bitcoin || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Stripe Public Key</label>
                    <input className="form-control" name="stripePubKey" defaultValue={settings?.stripePubKey || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Stripe Secret Key</label>
                    <input className="form-control" name="stripeSecretKey" type="password" defaultValue={settings?.stripeSecretKey || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Stripe (on/off)</label>
                    <select className="form-control" name="stripe" defaultValue={String(settings?.stripe || 0)}>
                      <option value="0">Off</option>
                      <option value="1">On</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="text-white">CoinPayments Key</label>
                    <input className="form-control" name="coinpayments" defaultValue={settings?.coinpayments || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">IPN Secret</label>
                    <input className="form-control" name="ipnSecret" defaultValue={settings?.ipnSecret || ''} />
                  </div>
                  <button type="submit" className="btn btn-primary">Save Payment Settings</button>
                </form>
              </div>
            </div>
          </div>

          {/* SMTP Settings */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">SMTP Settings</h4>
                <form method="POST" action="/web/api/admin/settings" className="mt-4">
                  <input type="hidden" name="action" value="update" />
                  <div className="form-group">
                    <label className="text-white">SMTP Host</label>
                    <input className="form-control" name="smtp_host" defaultValue={smtp?.host || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">SMTP Port</label>
                    <input className="form-control" name="smtp_port" type="number" defaultValue={smtp?.port || 587} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">SMTP Username</label>
                    <input className="form-control" name="smtp_username" defaultValue={smtp?.username || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">SMTP Password</label>
                    <input className="form-control" name="smtp_password" type="password" defaultValue={smtp?.password || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">SMTP Auth</label>
                    <input className="form-control" name="smtp_auth" defaultValue={smtp?.auth || ''} />
                  </div>
                  <button type="submit" className="btn btn-primary">Save SMTP Settings</button>
                </form>
              </div>
            </div>
          </div>

          {/* Misc Settings */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Other Settings</h4>
                <form method="POST" action="/web/api/admin/settings" className="mt-4">
                  <input type="hidden" name="action" value="update" />
                  <div className="form-group">
                    <label className="text-white">Key (App Secret)</label>
                    <input className="form-control" name="key" defaultValue={settings?.key || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Secret Key</label>
                    <input className="form-control" name="secretKey" defaultValue={settings?.secretKey || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Issuer ID</label>
                    <input className="form-control" name="issuerId" defaultValue={settings?.issuerId || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Google Site Key</label>
                    <input className="form-control" name="google_site" defaultValue={settings?.google_site || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Google Secret</label>
                    <input className="form-control" name="google_secret" defaultValue={settings?.google_secret || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Skype</label>
                    <input className="form-control" name="skype" defaultValue={settings?.skype || ''} />
                  </div>
                  <div className="form-group">
                    <label className="text-white">Cloudflare</label>
                    <select className="form-control" name="cloudflare" defaultValue={String(settings?.cloudflare || 0)}>
                      <option value="0">Off</option>
                      <option value="1">On</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Save Other Settings</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}