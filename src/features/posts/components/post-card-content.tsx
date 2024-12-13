import { PostCard } from '@/features/posts/components/post-card'
import { fetcher } from '@/libs/fetcher'
import { client } from '@/libs/rpc'
import { auth } from '@clerk/nextjs/server'
import type { InferResponseType } from 'hono'
import qs from 'qs'

const url = client.api.posts.$url()
type ResType = InferResponseType<typeof client.api.posts.$get>

type PostCardContentProps = {
  content: string
}

export const PostCardContent = async ({ content }: PostCardContentProps) => {
  const { userId } = await auth()

  const query = content ? { content } : userId ? { userId } : {}

  const queryString = qs.stringify(query)
  const requestUrl = `${url}${queryString ? `?${queryString}` : ''}`

  const res = await fetcher<ResType>(requestUrl, {
    next: { tags: ['posts'] },
  })

  return res.posts.map((post) => <PostCard key={post.id} post={post} />)
}
