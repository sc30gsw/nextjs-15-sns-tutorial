import { db } from '@/libs/db/drizzle'
import { follows, users } from '@/libs/db/schema'
import { desc, eq, ne } from 'drizzle-orm'
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

  const userWithoutMe = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
    where: ne(users.id, userId),
  })

  const following = await db.query.follows.findMany({
    where: eq(follows.followingId, userId),
    with: {
      follower: true,
      following: true,
    },
  })

  const followers = await db.query.follows.findMany({
    where: eq(follows.followerId, userId),
    with: {
      follower: true,
      following: true,
    },
  })

  return c.json({ user, userWithoutMe, followers, following }, 200)
})

export default app
