'use server'

import { postSearchFormSchema } from '@/features/posts/types/schema/post-search-form-schema'
import { currentUser } from '@clerk/nextjs/server'
import { parseWithZod } from '@conform-to/zod'
import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export const searchPost = async (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema: postSearchFormSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const user = await currentUser()

  if (!user) {
    return submission.reply()
  }

  const pathname = formData.get('pathname')

  if (pathname && pathname !== '/') {
    redirect(`/?content=${submission.value.content}`)
  }

  revalidateTag('posts')

  return submission.reply()
}
