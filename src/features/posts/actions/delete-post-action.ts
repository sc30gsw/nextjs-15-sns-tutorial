'use server'

import { fetcher } from '@/libs/fetcher'
import { client } from '@/libs/rpc'
import type { InferRequestType } from 'hono'
import { revalidateTag } from 'next/cache'

const $post = client.api.posts[':postId']
type RequestType = InferRequestType<(typeof $post)['$delete']>

export const deletePost = async (postId: string) => {
  try {
    const url = $post.$url({
      param: { postId },
    })

    await fetcher<RequestType>(url, {
      method: 'DELETE',
    })

    revalidateTag('posts')

    return { isSuccess: true }
  } catch (err) {
    return { isSuccess: false }
  }
}
