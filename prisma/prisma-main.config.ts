import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'schema-main.prisma',
  datasource: {
    url: env('DATABASE_URL_MAIN'),
  },
})