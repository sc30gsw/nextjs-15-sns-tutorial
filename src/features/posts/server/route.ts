import { db } from '@/libs/db/drizzle'
import { follows, posts } from '@/libs/db/schema'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono()
  .get('/', async (c) => {
    const userId = c.req.query('userId')

    if (typeof userId !== 'string' || userId === 'null') {
      const postList = await db.query.posts.findMany({
        with: {
          author: true,
          replies: true,
          likes: true,
        },
        orderBy: [desc(posts.createdAt)],
      })

      return c.json({ posts: postList }, 200)
    }

    // フォローしているユーザーを取得
    const following = await db.query.follows.findMany({
      where: eq(follows.followerId, userId),
      columns: {
        followingId: true,
      },
    })

    const followingIds = following.map((follow) => follow.followingId)

    const postList = await db.query.posts.findMany({
      with: {
        author: true,
        replies: true,
        likes: true,
      },
      where: and(inArray(posts.authorId, followingIds)),
      orderBy: [desc(posts.createdAt)],
    })

    return c.json({ posts: postList }, 200)
  })
  .get('/:postId', async (c) => {
    const { postId } = c.req.param()

    const post = await db.query.posts.findFirst({
      with: {
        author: true,
        replies: true,
        likes: true,
      },
      where: eq(posts.id, postId),
    })

    return c.json({ post }, 200)
  })
  .delete('/:postId', async (c) => {
    const { postId } = c.req.param()

    await db.delete(posts).where(eq(posts.id, postId))

    return c.json({ isSuccess: true }, 200)
  })

export default app
