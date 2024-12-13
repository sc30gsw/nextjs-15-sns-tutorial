'use client'

import { Avatar, Separator } from '@/components/ui'
import { ReplyForm } from '@/features/replies/components/reply-form'
import { ReplyLikeButton } from '@/features/replies/components/reply-like-button'
import type { client } from '@/libs/rpc'
import type { InferResponseType } from 'hono'
import Link from 'next/link'
import { useOptimistic } from 'react'
import { v4 as uuidv4 } from 'uuid'

type ResType = InferResponseType<(typeof client.api.replies)[':postId']['$get']>
type Reply = ResType['replies'][number]

type InitialReply = {
  id: string
  content: string
  author: {
    id: string
    name: string
    image: string
  }
  likes: {
    postId: string
    userId: string
  }[]
}

type PostRepliesProps = {
  replies: Reply[]
}

export const PostReplies = ({ replies }: PostRepliesProps) => {
  const initialOptimisticReplies = replies.map((reply) => ({
    id: reply.id,
    content: reply.content,
    author: {
      id: reply.author.id,
      name: reply.author.name,
      image: reply.author.image ?? '/placeholder.png',
    },
    likes: reply.likes.map((like) => ({
      postId: like.postId,
      userId: like.userId,
    })),
  }))

  const [optimisticReplies, addOptimisticReply] = useOptimistic(
    initialOptimisticReplies,
    (currentState, newState: InitialReply) => [
      {
        id: uuidv4(),
        content: newState.content,
        author: {
          ...newState.author,
          image: newState.author.image ?? '/placeholder.png',
          name: newState.author.name,
        },
        likes: newState.likes,
      },
      ...currentState,
    ],
  )

  return (
    <div className="flex flex-col gap-4 w-full">
      <ReplyForm addOptimisticReply={addOptimisticReply} />

      {optimisticReplies.map((reply, index) => (
        <>
          {index !== 0 && <Separator className="mb-4" />}
          <div key={reply.id} className="flex w-full items-center gap-4">
            <Link href={`/profile/${reply.author.id}`}>
              <Avatar
                src={reply.author.image ?? '/placeholder.png'}
                alt="avatar"
                initials="A"
              />
            </Link>
            <div className="flex-1">
              <div className="flex justify-between items-start w-full">
                <div className="space-y-1">
                  <p className="font-semibold">{reply.author.name}</p>
                  <p className="text-neutral-400 text-sm">
                    @{reply.author?.id}
                  </p>
                </div>
                <ReplyLikeButton
                  replyId={reply.id}
                  initialLikes={reply.likes.map((like) => like.userId)}
                />
              </div>
              <p className="mt-2 text-base break-words">{reply.content}</p>
            </div>
          </div>
        </>
      ))}
    </div>
  )
}
