'use client'

import { Menu } from '@/components/ui'
import { deletePost } from '@/features/posts/actions/delete-post-action'
import type { client } from '@/libs/rpc'
import { useUser } from '@clerk/nextjs'
import type { InferResponseType } from 'hono'
import {
  IconDotsHorizontal,
  IconPencilBox,
  IconResizeOutIn,
  IconTrashEmpty,
} from 'justd-icons'
import Link from 'next/link'
import { useTransition } from 'react'
import { toast } from 'sonner'

type Post = InferResponseType<typeof client.api.posts.$get>['posts'][number]

type PostMenuProps = {
  post: Post
}

export const PostMenu = ({ post }: PostMenuProps) => {
  const { user } = useUser()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePost(post.id)

      if (result.isSuccess) {
        toast.success('Post deleted successfully')
      } else {
        toast.error('Failed to delete post')
      }
    })
  }

  return (
    <Menu>
      <Menu.Trigger>
        <IconDotsHorizontal />
      </Menu.Trigger>
      <Menu.Content className="min-w-48" placement="bottom">
        <Menu.Item isDisabled={isPending}>
          <Link href={`/posts/${post.id}`} className="flex items-center gap-1">
            <IconResizeOutIn />
            View
          </Link>
        </Menu.Item>
        {post.authorId === user?.id && (
          <>
            <Menu.Item isDisabled={isPending} onAction={() => toast('foo')}>
              <IconPencilBox />
              Edit
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item
              isDanger={true}
              onAction={handleDelete}
              isDisabled={isPending}
            >
              <IconTrashEmpty />
              Delete
            </Menu.Item>
          </>
        )}
      </Menu.Content>
    </Menu>
  )
}
