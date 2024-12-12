'use client'

import { Avatar, Separator } from '@/components/ui'
import { ReplyForm } from '@/features/replies/components/reply-form'
import type { client } from '@/libs/rpc'
import type { InferResponseType } from 'hono'
import { IconHeart } from 'justd-icons'
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
}

type PostRepliesProps = {
  replies: Reply[]
}

export const PostReplies = ({ replies }: PostRepliesProps) => {
  const initialOptimisticReplies = replies.map((reply) => ({
    id: uuidv4(),
    content: reply.content,
    author: {
      id: reply.author.id,
      name: reply.author.name,
      image: reply.author.image ?? '/placeholder.png',
    },
  }))

  const [optimisticReplies, addOptimisticReply] = useOptimistic(
    initialOptimisticReplies,
    (currentState, newState: InitialReply) => [
      ...currentState,
      {
        id: uuidv4(),
        content: newState.content,
        author: {
          ...newState.author,
          image: newState.author.image ?? '/placeholder.png',
          name: newState.author.name,
        },
      },
    ],
  )

  return (
    <div className="flex flex-col gap-4 w-full">
      <ReplyForm addOptimisticReply={addOptimisticReply} />

      {optimisticReplies.map((reply, index) => (
        <>
          {index !== 0 && <Separator className="mb-4" />}
          <div key={reply.id} className="flex w-full items-center gap-4">
            <Avatar
              src={reply.author.image ?? '/placeholder.png'}
              alt="avatar"
              initials="A"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start w-full">
                <div className="space-y-1">
                  <p className="font-semibold">{reply.author.name}</p>
                  <p className="text-neutral-400 text-sm">
                    @{reply.author?.id}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <IconHeart className="size-5" />
                </button>
              </div>
              <p className="mt-2 text-base break-words">{reply.content}</p>
            </div>
          </div>
        </>
      ))}
    </div>
  )
}
