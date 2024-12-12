import { Card, Separator } from '@/components/ui'
import { PostCard } from '@/features/posts/components/post-card'
import { PostReplies } from '@/features/replies/components/post-replies'
import { ReplySkelton } from '@/features/replies/components/reply-skelton'
import { fetcher } from '@/libs/fetcher'
import { client } from '@/libs/rpc'
import type { InferResponseType } from 'hono'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

const fetchPost = async (postId: string) => {
  type ResType = InferResponseType<(typeof client.api.posts)[':postId']['$get']>

  const url = client.api.posts[':postId'].$url({
    param: { postId },
  })

  const res = await fetcher<ResType>(url, {
    next: { tags: [`posts/${postId}`] },
  })

  if (!res.post) {
    notFound()
  }

  return res
}

const fetchReplies = async (postId: string) => {
  type ResType = InferResponseType<
    (typeof client.api.replies)[':postId']['$get']
  >

  const url = client.api.replies[':postId'].$url({
    param: { postId },
  })

  const res = await fetcher<ResType>(url, {
    next: { tags: [`replies/${postId}`] },
  })

  return res
}

type PostIdPageParams = {
  params: Promise<{
    postId: string
  }>
}

const PostIdPage = async ({ params }: PostIdPageParams) => {
  const postId = (await params).postId

  const [postResult, repliesResult] = await Promise.all([
    fetchPost(postId),
    fetchReplies(postId),
  ])

  if (!postResult.post) {
    return <div>Not Found</div>
  }

  return (
    <PostCard post={postResult.post}>
      <Card.Footer className="flex flex-col gap-4">
        <Suspense
          fallback={
            <div className="w-full flex flex-col gap-4">
              <ReplySkelton />
              <Separator />
              <ReplySkelton />
              <Separator />
              <ReplySkelton />
            </div>
          }
        >
          <PostReplies replies={repliesResult.replies} />
        </Suspense>
      </Card.Footer>
    </PostCard>
  )
}

export default PostIdPage
