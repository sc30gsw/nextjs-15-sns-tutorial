import { db } from '@/libs/db/drizzle'
import { posts, replies, users } from '@/libs/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono().get('/:postId', async (c) => {
  const { postId } = c.req.param()
  const replyList = await db
    .select({
      replies,
      users,
      posts,
    })
    .from(replies)
    .leftJoin(users, eq(replies.authorId, users.id))
    .leftJoin(posts, eq(replies.postId, posts.id))
    .where(eq(replies.postId, postId))
    .orderBy(desc(replies.createdAt))

  return c.json({ replies: replyList })
})

export default app
