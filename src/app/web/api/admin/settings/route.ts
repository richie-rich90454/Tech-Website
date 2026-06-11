import { NextRequest, NextResponse } from 'next/server';
import { webDb } from '@/lib/db/web';

export async function GET() {
  const [settings, smtp] = await Promise.all([
    webDb.settings.findFirst(),
    webDb.smtpsettings.findFirst(),
  ]);
  return NextResponse.json({ settings, smtp });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const action = formData.get('action') as string;

  if (action === 'update') {
    // Updated at field for settings table uses sitename as PK
    const sitename = formData.get('sitename') as string;
    const url = formData.get('url') as string;
    const description = formData.get('description') as string;
    const cooldown = parseInt(formData.get('cooldown') as string) || 0;
    const cooldownTime = parseInt(formData.get('cooldownTime') as string) || 0;
    const maxattacks = parseInt(formData.get('maxattacks') as string) || 0;
    const testboots = parseInt(formData.get('testboots') as string) || 0;
    const maintaince = formData.get('maintaince') as string;
    const rotation = parseInt(formData.get('rotation') as string) || 0;
    const paypal = formData.get('paypal') as string;
    const paypal_email = formData.get('paypal_email') as string;
    const bitcoin = formData.get('bitcoin') as string;
    const stripePubKey = formData.get('stripePubKey') as string;
    const stripeSecretKey = formData.get('stripeSecretKey') as string;
    const stripe = parseInt(formData.get('stripe') as string) || 0;
    const coinpayments = formData.get('coinpayments') as string;
    const ipnSecret = formData.get('ipnSecret') as string;
    const key = formData.get('key') as string;
    const secretKey = formData.get('secretKey') as string;
    const issuerId = formData.get('issuerId') as string;
    const google_site = formData.get('google_site') as string;
    const google_secret = formData.get('google_secret') as string;
    const skype = formData.get('skype') as string;
    const cloudflare = parseInt(formData.get('cloudflare') as string) || 0;
    const smtp_host = formData.get('smtp_host') as string;
    const smtp_port = parseInt(formData.get('smtp_port') as string) || 587;
    const smtp_username = formData.get('smtp_username') as string;
    const smtp_password = formData.get('smtp_password') as string;
    const smtp_auth = formData.get('smtp_auth') as string;

    // Upsert settings
    const existing = await webDb.settings.findFirst();
    if (existing) {
      await webDb.settings.update({
        where: { sitename: existing.sitename },
        data: {
          sitename: sitename || existing.sitename,
          url, description, cooldown, cooldownTime, maxattacks, testboots,
          maintaince, rotation, paypal, paypal_email, bitcoin,
          stripePubKey, stripeSecretKey, stripe, coinpayments, ipnSecret,
          key, secretKey, issuerId, google_site, google_secret, skype, cloudflare,
        },
      });
    } else {
      await webDb.settings.create({
        data: {
          sitename: sitename || 'IPstress',
          url, description, cooldown, cooldownTime, maxattacks, testboots,
          maintaince, rotation, paypal, paypal_email, bitcoin,
          stripePubKey, stripeSecretKey, stripe, coinpayments, ipnSecret,
          key, secretKey, issuerId, google_site, google_secret, skype, cloudflare,
          system: 'basic', btc_address: '', cbp: 0, theme: '', logo: '',
        },
      });
    }

    // Upsert SMTP settings
    if (smtp_host) {
      const existingSmtp = await webDb.smtpsettings.findUnique({ where: { host: smtp_host } });
      if (existingSmtp) {
        await webDb.smtpsettings.update({
          where: { host: smtp_host },
          data: { auth: smtp_auth, username: smtp_username, password: smtp_password, port: smtp_port },
        });
      } else {
        // Delete old SMTP entry first (there can only be one)
        const anySmtp = await webDb.smtpsettings.findFirst();
        if (anySmtp) {
          await webDb.smtpsettings.delete({ where: { host: anySmtp.host } });
        }
        await webDb.smtpsettings.create({
          data: { host: smtp_host, auth: smtp_auth, username: smtp_username, password: smtp_password, port: smtp_port },
        });
      }
    }

    return NextResponse.redirect(new URL('/web/admin/settings', req.url));
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}