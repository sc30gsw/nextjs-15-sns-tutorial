'use server'

import { postEditFormSchema } from '@/features/posts/types/schema/post-edit-form-schema'
import { db } from '@/libs/db/drizzle'
import { posts } from '@/libs/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import { parseWithZod } from '@conform-to/zod'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

// https://conform.guide/integration/nextjs
export const editPost = async (_: unknown, formData: FormData) => {
  // https://conform.guide/api/zod/parseWithZod
  // formDataをzodのスキーマと照合
  const submission = parseWithZod(formData, { schema: postEditFormSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const user = await currentUser()

  if (!user) {
    return submission.reply()
  }

  await db
    .update(posts)
    .set({
      content: submission.value.content,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, submission.value.postId))

  revalidateTag('posts')

  return submission.reply()
}
