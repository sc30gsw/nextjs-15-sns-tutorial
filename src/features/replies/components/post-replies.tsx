import { Avatar, Separator } from '@/components/ui'
import { fetcher } from '@/libs/fetcher'
import { client } from '@/libs/rpc'
import type { InferResponseType } from 'hono'
import { IconHeart } from 'justd-icons'

type ResType = InferResponseType<(typeof client.api.replies)[':postId']['$get']>

type PostRepliesProps = {
  postId: string
}

export const PostReplies = async ({ postId }: PostRepliesProps) => {
  const url = client.api.replies[':postId'].$url({
    param: { postId },
  })

  const res = await fetcher<ResType>(url, {
    next: { tags: [`replies/${postId}`] },
  })

  return res.replies.map((item, index) => (
    <>
      {index !== 0 && <Separator />}
      <div key={item.replies.id} className="flex w-full gap-4 items-center">
        <Avatar
          src={item.users?.image ?? 'placeholder.png'}
          alt="avatar"
          initials="A"
        />
        <div className="flex justify-between items-center w-full">
          <div>
            <p className="text-base font-semibold">{item.users?.name}</p>
            <p className="text-lg">{item.replies.content}</p>
          </div>
          <button type="button">
            <IconHeart className="size-5" />
          </button>
        </div>
      </div>
    </>
  ))
}
