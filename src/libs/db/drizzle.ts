import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'

// https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon
config({ path: '.env.local' })

export const db = drizzle(process.env.DATABASE_URL ?? '')
