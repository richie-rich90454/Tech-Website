import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Resolve DATABASE_URL_MAIN to an absolute path anchored at the project root
// (this file's parent's parent). The seed script and the runtime adapter do
// the same on their side, so all three sides hit the same on-disk file.
const HERE = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(HERE, '..')
const dbPath = resolve(PROJECT_ROOT, 'prisma', 'main.db')

export default defineConfig({
  schema: 'schema-main.prisma',
  datasource: {
    url: `file:${dbPath}`,
  },
})