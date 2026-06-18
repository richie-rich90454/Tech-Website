import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/lib/db/generated/web';
import * as crypto from 'node:crypto';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL_WEB ?? 'file:./prisma/web.db',
});
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  console.log('Seeding web database...');

  // Upsert settings (sitename is the @id field)
  await prisma.settings.upsert({
    where: { sitename: 'IPstress' },
    update: {},
    create: {
      sitename: 'IPstress',
      stripePubKey: '',
      url: 'http://localhost:3000',
      description: 'Premium IP stress testing service',
      cooldown: 60,
      cooldownTime: 300,
      paypal: '',
      bitcoin: '',
      stripe: 0,
      maintaince: '0',
      rotation: 0,
      system: 'public',
      maxattacks: 5,
      testboots: 1,
      cloudflare: 0,
      skype: '',
      key: 'demo-api-key',
      issuerId: '',
      coinpayments: '',
      ipnSecret: '',
      google_site: '',
      google_secret: '',
      btc_address: '',
      secretKey: 'demo-secret',
      cbp: 0,
      paypal_email: '',
      theme: 'default',
      logo: '/images/logo-icon.png',
      stripeSecretKey: '',
    },
  });
  console.log('  ✓ Default settings created');

  // Insert demo plans
  const plans = [
    { ID: 1, name: 'Bronze', vip: 0, mbt: 1, unit: 'days', length: 7, price: 5.99, concurrents: 1, private: 0 },
    { ID: 2, name: 'Silver', vip: 0, mbt: 1, unit: 'days', length: 30, price: 14.99, concurrents: 3, private: 0 },
    { ID: 3, name: 'Gold', vip: 1, mbt: 1, unit: 'days', length: 30, price: 29.99, concurrents: 5, private: 0 },
    { ID: 4, name: 'Diamond', vip: 1, mbt: 1, unit: 'days', length: 90, price: 74.99, concurrents: 10, private: 0 },
  ];

  for (const plan of plans) {
    await prisma.plans.upsert({
      where: { ID: plan.ID },
      update: plan,
      create: plan,
    });
  }
  console.log('  ✓ 4 demo plans created');

  // Insert admin user
  const hashedPassword = hashPassword('admin123');
  await prisma.users.upsert({
    where: { ID: 1 },
    update: {
      password: hashedPassword,
      rank: 1,
    },
    create: {
      ID: 1,
      username: 'admin',
      password: hashedPassword,
      rank: 1,
      membership: 0,
      expire: 9999999999,
      status: 1,
      referral: '',
      referralbalance: 0,
      testattack: 1,
      activity: 0,
      twoauth: 0,
      referedBy: 0,
    },
  });
  console.log('  ✓ Admin user created (admin / admin123)');

  // Insert smtp settings
  await prisma.smtpsettings.upsert({
    where: { host: 'smtp.example.com' },
    update: {},
    create: {
      host: 'smtp.example.com',
      auth: 'tls',
      username: 'noreply@example.com',
      password: 'smtp-password',
      port: 587,
    },
  });
  console.log('  ✓ SMTP settings created');

  // Insert sample FAQ entries
  const faqs = [
    { id: 1, question: 'What is IP stress testing?', answer: 'IP stress testing is a method of testing the resilience and stability of network infrastructure by simulating high traffic volumes.' },
    { id: 2, question: 'Is this service legal?', answer: 'Our service is intended for testing your own infrastructure only. You must have explicit permission to test any network you do not own.' },
    { id: 3, question: 'How do I upgrade my plan?', answer: 'Navigate to the Plans page, select your desired plan, and complete payment through one of our supported payment methods.' },
    { id: 4, question: 'Can I get a refund?', answer: 'Refunds are handled on a case-by-case basis. Please contact support via the ticket system.' },
    { id: 5, question: 'How do I reset my password?', answer: 'Go to the login page and click "Forgot Password" to receive a password reset link via email.' },
  ];

  for (const faq of faqs) {
    await prisma.faq.upsert({
      where: { id: faq.id },
      update: faq,
      create: faq,
    });
  }
  console.log('  ✓ 5 FAQ entries created');

  console.log('Web database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });