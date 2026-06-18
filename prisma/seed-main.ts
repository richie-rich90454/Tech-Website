import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/lib/db/generated/main';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL_MAIN ?? 'file:./prisma/main.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding main database...');

  // Upsert admin login (id is not auto-increment in this schema)
  await prisma.login.upsert({
    where: { User: 'admin' },
    update: { PW: 'admin123' },
    create: { User: 'admin', PW: 'admin123' },
  });
  console.log('  ✓ Admin login created (admin / admin123)');

  // Upsert domains (id is not auto-increment)
  const domainsData = {
    R: true,
    TP: true,
    MT: true,
    AR: true,
    U: true,
    MDL: true,
    RA: true,
    RoTech: true,
    LS: true,
    RoThink: true,
    EoST: true,
    EF: true,
    RTE: true,
    DLoI: true,
    RaAoC: true,
  };

  await prisma.domains.upsert({
    where: { id: 1 },
    update: domainsData,
    create: { id: 1, ...domainsData },
  });
  console.log('  ✓ Domains config created');

  // Insert sample accepted submissions
  const submissions = [
    {
      id: 1,
      techname: 'Canvas LMS',
      tl1_desc: 'Learning management system for course delivery and assessment',
      tl2_desc: 'Supports collaborative learning through group discussions and peer review',
      tl3_desc: 'Built-in analytics for tracking student progress and engagement',
      tl4_desc: 'Reflective journal tools and portfolio building features',
      link: 'https://canvas.instructure.com',
      displaytext: 'Canvas',
      accepted: true,
      username: 'demo',
      contact: 'demo@example.com',
    },
    {
      id: 2,
      techname: 'Padlet',
      tl1_desc: 'Digital bulletin board for sharing ideas and resources',
      tl2_desc: 'Real-time collaboration boards for group activities',
      tl3_desc: 'Export and share student work for assessment evidence',
      tl4_desc: 'Students can reflect on their learning through multimedia posts',
      link: 'https://padlet.com',
      displaytext: 'Padlet',
      accepted: true,
      username: 'demo',
      contact: 'demo@example.com',
    },
    {
      id: 3,
      techname: 'Kahoot!',
      tl1_desc: 'Game-based quiz platform for formative assessment',
      tl2_desc: 'Team mode encourages peer discussion and collaboration',
      tl3_desc: 'Instant feedback on student understanding',
      tl4_desc: 'Student-paced challenges for self-directed learning',
      link: 'https://kahoot.com',
      displaytext: 'Kahoot!',
      accepted: true,
      username: 'demo',
      contact: 'demo@example.com',
    },
    {
      id: 4,
      techname: 'Google Workspace for Education',
      tl1_desc: 'Suite of tools for creating and managing learning content',
      tl2_desc: 'Google Docs and Slides enable real-time collaborative work',
      tl3_desc: 'Google Classroom for assignment distribution and grading',
      tl4_desc: 'Students curate portfolios of their work across subjects',
      link: 'https://edu.google.com',
      displaytext: 'Google Workspace',
      accepted: true,
      username: 'demo',
      contact: 'demo@example.com',
    },
    {
      id: 5,
      techname: 'Edpuzzle',
      tl1_desc: 'Interactive video lessons with embedded questions',
      tl2_desc: 'Students can comment and reply on video segments',
      tl3_desc: 'Teacher dashboard shows video completion and quiz data',
      tl4_desc: 'Encourages self-paced review and reflection on content',
      link: 'https://edpuzzle.com',
      displaytext: 'Edpuzzle',
      accepted: true,
      username: 'demo',
      contact: 'demo@example.com',
    },
  ];

  for (const sub of submissions) {
    await prisma.submission.upsert({
      where: { id: sub.id },
      update: sub,
      create: sub,
    });
  }
  console.log('  ✓ 5 sample submissions created');

  console.log('Main database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });