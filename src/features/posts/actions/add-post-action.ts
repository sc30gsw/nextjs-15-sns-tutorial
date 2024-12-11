'use server'

import { postFormSchema } from '@/features/posts/types/schema/post-form-schema'
import { db } from '@/libs/db/drizzle'
import { posts } from '@/libs/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import { parseWithZod } from '@conform-to/zod'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

// https://conform.guide/integration/nextjs
export const addPost = async (_: unknown, formData: FormData) => {
  // https://conform.guide/api/zod/parseWithZod
  // formDataをzodのスキーマと照合
  const submission = parseWithZod(formData, { schema: postFormSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const user = await currentUser()

  if (!user) {
    return submission.reply()
  }

  await db.insert(posts).values({
    id: uuidv4(),
    authorId: user.id,
    content: submission.value.content,
  })

  redirect('/')
}
