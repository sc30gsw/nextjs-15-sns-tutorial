import { db } from '@/libs/db/drizzle'
import { likes, posts, replies, users } from '@/libs/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'

const app = new Hono()
  .get('/', async (c) => {
    const postList = await db
      .select({
        posts,
        users,
        repliesCount: db.$count(replies, eq(replies.postId, posts.id)),
        likesCount: db.$count(likes, eq(likes.postId, posts.id)),
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(replies, eq(replies.postId, posts.id))
      .leftJoin(likes, eq(likes.postId, posts.id))
      .orderBy(desc(posts.createdAt))

    return c.json({ posts: postList })
  })
  .get('/:postId', async (c) => {
    const { postId } = c.req.param()
    const post = await db
      .select({
        posts,
        users,
        repliesCount: db.$count(replies, eq(replies.postId, posts.id)),
        likesCount: db.$count(likes, eq(likes.postId, posts.id)),
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(replies, eq(replies.postId, posts.id))
      .leftJoin(likes, eq(likes.postId, posts.id))
      .where(eq(posts.id, postId))
      .orderBy(desc(replies.createdAt))

    return c.json({ post: post[0] })
  })

export default app
