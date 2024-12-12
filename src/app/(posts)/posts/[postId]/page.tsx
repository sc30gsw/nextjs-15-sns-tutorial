import { Card, Separator } from '@/components/ui'
import { PostCard } from '@/features/posts/components/post-card'
import { PostReplies } from '@/features/replies/components/post-replies'
import { ReplyForm } from '@/features/replies/components/reply-form'
import { ReplySkelton } from '@/features/replies/components/reply-skelton'
import { fetcher } from '@/libs/fetcher'
import { client } from '@/libs/rpc'
import type { InferResponseType } from 'hono'
import { Suspense } from 'react'

type PostListResType = InferResponseType<typeof client.api.posts.$get>

export const generateStaticParams = async () => {
  const url = client.api.posts.$url()

  const res = await fetcher<PostListResType>(url.toString(), {
    next: { tags: ['posts'] },
  })

  return res.posts.map((post) => ({ postId: post.id }))
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

  if (!res.post) {
    return <div>Not Found</div>
  }

  return (
    <PostCard post={res.post}>
      <Card.Footer className="flex flex-col gap-4">
        <ReplyForm />
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
          <PostReplies postId={postId} />
        </Suspense>
      </Card.Footer>
    </PostCard>
  )
}

export default PostIdPage
