'use server'

import { likeFormSchema } from '@/features/likes/types/schema/like-form-schema'
import { db } from '@/libs/db/drizzle'
import { likes } from '@/libs/db/schema'
import { auth } from '@clerk/nextjs/server'
import { parseWithZod } from '@conform-to/zod'
import { and, eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

export const likeAction = async (_: unknown, formData: FormData) => {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const submission = parseWithZod(formData, {
    schema: likeFormSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const existedLike = await db.query.likes.findFirst({
    where: and(
      eq(likes.postId, submission.value.postId),
      eq(likes.userId, userId),
    ),
  })

  if (existedLike) {
    await db.delete(likes).where(eq(likes.id, existedLike.id))
  } else {
    await db.insert(likes).values({
      id: uuidv4(),
      postId: submission.value.postId,
      userId,
    })
  }

  revalidateTag(`likes/${submission.value.postId}`)
}
