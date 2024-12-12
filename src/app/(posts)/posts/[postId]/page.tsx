import { PostCard } from '@/features/posts/components/post-card'
import { fetcher } from '@/libs/fetcher'
import { client } from '@/libs/rpc'
import type { InferResponseType } from 'hono'

type PostListResType = InferResponseType<typeof client.api.posts.$get>

export const generateStaticParams = async () => {
  const url = client.api.posts.$url()

  const res = await fetcher<PostListResType>(url.toString(), {
    next: { tags: ['posts'] },
  })

  return res.posts.map((item) => ({ postId: item.posts.id }))
}

type PostIdPageParams = {
  params: Promise<{
    postId: string
  }>
}

type ResType = InferResponseType<(typeof client.api.posts)[':postId']['$get']>

const PostIdPage = async ({ params }: PostIdPageParams) => {
  const postId = (await params).postId
  const url = client.api.posts[':postId'].$url({
    param: { postId },
  })

  const res = await fetcher<ResType>(url, {
    next: { tags: [`posts/${postId}`] },
  })

  return <PostCard item={res.post} />
}

export default PostIdPage
