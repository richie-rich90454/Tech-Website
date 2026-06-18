import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(HERE, '..')
const dbPath = resolve(PROJECT_ROOT, 'prisma', 'web.db')

export default defineConfig({
  schema: 'schema-web.prisma',
  datasource: {
    url: `file:${dbPath}`,
  },
})