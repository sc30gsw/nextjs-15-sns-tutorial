import { Avatar, Card, Separator } from '@/components/ui'
import { PostReplies } from '@/features/replies/components/post-replies'
import { ReplySkelton } from '@/features/replies/components/reply-skelton'
import type { client } from '@/libs/rpc'
import { formatTimeAgo } from '@/utils/format-time'
import type { InferResponseType } from 'hono'
import { IconClock, IconForward, IconHeart, IconMessage } from 'justd-icons'
import Link from 'next/link'
import { type ReactNode, Suspense } from 'react'

type Post = InferResponseType<typeof client.api.posts.$get>['posts'][number]

type PostCardProps = {
  item: Post
  children?: ReactNode
}

export const PostCard = ({ item, children }: PostCardProps) => {
  return (
    <Card>
      <Card.Header>
        <div className="flex w-full gap-4 items-center">
          <Avatar
            src={item.users?.image ?? 'placeholder.png'}
            alt="item avatar"
            initials="PA"
          />
          <div className="flex gap-0 sm:gap-2 flex-col sm:flex-row">
            <h5 className="text-base font-semibold">
              {item.users?.name ?? 'John Doe'}
            </h5>
            <p className="text-neutral-400">@{item.users?.id}</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        <Link href={`/posts/${item.posts.id}`}>
          <p className="break-words text-lg">{item.posts.content}</p>
        </Link>
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-6">
            <button type="button" className="flex items-center gap-2">
              <IconHeart className="size-5" />
              <span>{item.likesCount}</span>
            </button>
            <button type="button" className="flex items-center gap-2">
              <IconMessage className="size-5" />
              <span>{item.repliesCount}</span>
            </button>
            <button type="button">
              <IconForward className="size-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <IconClock className="size-4" />
            <span className="text-sm text-neutral-400">
              {formatTimeAgo(new Date(item.posts.createdAt))} ago
            </span>
          </div>
        </div>
        <Separator />
      </Card.Content>
      <Card.Footer className="flex flex-col gap-4">
        {children}
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
          <PostReplies postId={item.posts.id} />
        </Suspense>
      </Card.Footer>
    </Card>
  )
}
