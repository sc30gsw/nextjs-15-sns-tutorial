import { db } from '@/libs/db/drizzle'
import { follows, users } from '@/libs/db/schema'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/:userId', async (c) => {
  const { userId } = c.req.param()

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      posts: {
        with: {
          author: true,
          replies: true,
          likes: true,
        },
      },
    },
  })

  const following = await db.query.follows.findMany({
    where: eq(follows.followerId, userId),
    columns: {
      followingId: true,
    },
  })

  const followers = await db.query.follows.findMany({
    where: eq(follows.followingId, userId),
    columns: {
      followerId: true,
    },
  })

  return c.json({ user, followers, following }, 200)
})

export default app
