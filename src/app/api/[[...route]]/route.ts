import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import posts from '@/features/posts/server/route'
import replies from '@/features/replies/server/route'
import users from '@/features/users/server/route'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

const routes = app
  .route('/posts', posts)
  .route('/replies', replies)
  .route('/users', users)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
