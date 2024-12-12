import {} from '@/components/ui'
import { PostCard } from '@/features/posts/components/post-card'
import { fetcher } from '@/libs/fetcher'
import { client } from '@/libs/rpc'
import { auth } from '@clerk/nextjs/server'
import type { InferResponseType } from 'hono'

const url = client.api.posts.$url()
type ResType = InferResponseType<typeof client.api.posts.$get>

export const PostCardContent = async () => {
  const { userId } = await auth()

  const res = await fetcher<ResType>(`${url}?userId=${null}`, {
    next: { tags: ['posts'] },
  })

  return res.posts.map((post) => <PostCard key={post.id} post={post} />)
}
