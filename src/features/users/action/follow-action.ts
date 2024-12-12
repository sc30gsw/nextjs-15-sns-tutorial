'use server'

import { followFormSchema } from '@/features/users/type/schema/follow-form-schema'
import { db } from '@/libs/db/drizzle'
import { follows } from '@/libs/db/schema'
import { auth } from '@clerk/nextjs/server'
import { parseWithZod } from '@conform-to/zod'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const followAction = async (_: unknown, formData: FormData) => {
  const { userId: currentUserId } = await auth()

  if (!currentUserId) {
    throw new Error('Unauthorized')
  }

  const submission = parseWithZod(formData, {
    schema: followFormSchema,
  })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  // unfollow
  const existedFollow = await db.query.follows.findFirst({
    where: and(
      eq(follows.followerId, submission.value.userId),
      eq(follows.followingId, currentUserId),
    ),
  })

  if (existedFollow) {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, submission.value.userId),
          eq(follows.followingId, currentUserId),
        ),
      )
  } else {
    // follow
    await db.insert(follows).values({
      followerId: submission.value.userId,
      followingId: currentUserId,
    })
  }

  revalidatePath(`/profile/${submission.value.userId}`)

  return submission.reply()
}
