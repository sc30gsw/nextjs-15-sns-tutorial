import { relations, sql } from 'drizzle-orm'
import {
  check,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    email: text('email').unique().notNull(),
    name: text('name'),
    image: text('image'),
    bio: text('bio'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (users) => ({
    idIdx: index('users_id_idx').on(users.id),
    emailIdx: index('users_email_idx').on(users.email),
    nameIdx: index('users_name_idx').on(users.name),
  }),
)

export const userRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  replies: many(replies),
  followers: many(follows, { relationName: 'follower' }),
  following: many(follows, { relationName: 'following' }),
}))

export const posts = pgTable(
  'posts',
  {
    id: text('id').primaryKey(),
    content: text('content').notNull(),
    authorId: text('author_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (posts) => ({
    idIdx: index('posts_id_idx').on(posts.id),
    authorIdx: index('posts_author_idx').on(posts.authorId),
    createdAtIdx: index('posts_created_at_idx').on(posts.createdAt),
  }),
)

export const postRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  likes: many(likes),
  replies: many(replies),
}))

export const likes = pgTable(
  'likes',
  {
    id: text('id').primaryKey(),
    postId: text('post_id').references(() => posts.id),
    replyId: text('reply_id').references(() => replies.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (like) => ({
    postUserUnique: index('likes_post_user_unique').on(
      like.postId,
      like.userId,
    ),
    replyUserUnique: index('likes_reply_user_unique').on(
      like.replyId,
      like.userId,
    ),
    postIdx: index('likes_post_idx').on(like.postId),
    replyIdx: index('likes_reply_idx').on(like.replyId),
    userIdx: index('likes_user_idx').on(like.userId),
    createdAtIdx: index('likes_created_at_idx').on(like.createdAt),
    targetCheck: check(
      'likes_target_check',
      sql`post_id IS NOT NULL OR reply_id IS NOT NULL`,
    ),
    exclusiveCheck: check(
      'likes_exclusive_check',
      sql`NOT (post_id IS NOT NULL AND reply_id IS NOT NULL)`,
    ),
  }),
)

export const likeRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  reply: one(replies, {
    fields: [likes.replyId],
    references: [replies.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}))

export const replies = pgTable(
  'replies',
  {
    id: text('id').primaryKey(),
    content: text('content').notNull(),
    authorId: text('author_id')
      .notNull()
      .references(() => users.id),
    postId: text('post_id')
      .notNull()
      .references(() => posts.id),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (replies) => ({
    idIdx: index('replies_id_idx').on(replies.id),
    authorIdx: index('replies_author_idx').on(replies.authorId),
    postIdx: index('replies_post_idx').on(replies.postId),
    createdAtIdx: index('replies_created_at_idx').on(replies.createdAt),
  }),
)

export const replyRelations = relations(replies, ({ one, many }) => ({
  author: one(users, {
    fields: [replies.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [replies.postId],
    references: [posts.id],
  }),
  likes: many(likes),
}))

export const follows = pgTable(
  'follows',
  {
    followerId: text('follower_id')
      .notNull()
      .references(() => users.id),
    followingId: text('following_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (follow) => ({
    compositePk: primaryKey({
      columns: [follow.followerId, follow.followingId],
    }),
    selfFollow: check('self_follow_check', sql`follower_id <> following_id`),
    followerIdx: index('follower_idx').on(follow.followerId),
    followingIdx: index('following_idx').on(follow.followingId),
  }),
)

export const followRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
  }),
}))
