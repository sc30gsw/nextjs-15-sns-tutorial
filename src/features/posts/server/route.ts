import { db } from '@/libs/db/drizzle'
import { posts } from '@/libs/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono()
  .get('/', async (c) => {
    const postList = await db.query.posts.findMany({
      with: {
        author: true,
        replies: true,
        likes: true,
      },
      orderBy: [desc(posts.createdAt)],
    })

    return c.json({ posts: postList })
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

    return c.json({ post })
  })

export default app
