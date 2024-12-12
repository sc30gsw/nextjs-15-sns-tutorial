// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as schema from '@/libs/db/schema'
import { drizzle } from 'drizzle-orm/neon-http'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

export const db = drizzle(process.env.DATABASE_URL, { schema })
