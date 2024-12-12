import { db } from '@/libs/db/drizzle'
import { replies } from '@/libs/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/:postId', async (c) => {
  const { postId } = c.req.param()

  const replyList = await db.query.replies.findMany({
    with: {
      author: true,
      post: true,
    },
    orderBy: [desc(replies.createdAt)],
    where: eq(replies.postId, postId),
  })

  return c.json({ replies: replyList })
})

export default app
