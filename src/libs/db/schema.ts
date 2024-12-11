import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const users = pgTable(
  'users',
  {
    id: integer('id').primaryKey(),
    email: text('email').unique().notNull(),
    name: text('name'),
    image: text('image'),
    bio: text('bio'),
    emailVerified: boolean('email_verified').notNull().default(false),
    password: text('password').notNull(),
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
    id: integer('id').primaryKey(),
    content: text('content').notNull(),
    authorId: integer('author_id')
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
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (like) => ({
    compositePk: primaryKey({ columns: [like.userId, like.postId] }),
    postIdx: index('likes_post_idx').on(like.postId),
    userIdx: index('likes_user_idx').on(like.userId),
    createdAtIdx: index('likes_created_at_idx').on(like.createdAt),
  }),
)

export const likeRelations = relations(likes, ({ one }) => ({
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}))

export const replies = pgTable(
  'replies',
  {
    id: integer('id').primaryKey(),
    content: text('content').notNull(),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id),
    postId: integer('post_id')
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

export const replyRelations = relations(replies, ({ one }) => ({
  author: one(users, {
    fields: [replies.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [replies.postId],
    references: [posts.id],
  }),
}))

export const follows = pgTable(
  'follows',
  {
    followerId: integer('follower_id')
      .notNull()
      .references(() => users.id),
    followingId: integer('following_id')
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
