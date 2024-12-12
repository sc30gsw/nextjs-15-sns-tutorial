'use server'

import { replyFormSchema } from '@/features/replies/types/schema/reply-form-schema'
import { db } from '@/libs/db/drizzle'
import { replies } from '@/libs/db/schema'
import { currentUser } from '@clerk/nextjs/server'
import { parseWithZod } from '@conform-to/zod'
import { revalidateTag } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export const addReply = async (_: unknown, formData: FormData) => {
  const user = await currentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const submission = parseWithZod(formData, {
    schema: replyFormSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  await db.insert(replies).values({
    id: uuidv4(),
    postId: submission.value.postId,
    authorId: user.id,
    content: submission.value.content,
  })

  revalidateTag(`replies/${submission.value.postId}`)
}
