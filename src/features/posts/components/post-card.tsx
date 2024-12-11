import { Avatar, Card, Separator } from '@/components/ui'
import { PostComments } from '@/features/comments/components/post-comments'
import { currentUser } from '@clerk/nextjs/server'
import { IconClock, IconForward, IconHeart, IconMessage } from 'justd-icons'

export const PostCard = async () => {
  const user = await currentUser()

  return (
    <Card>
      <Card.Header>
        <div className="flex w-full gap-4 items-center">
          <Avatar src={'placeholder.png'} alt="avatar" initials="A" />
          <div>
            <h5 className="text-xl font-bold">name</h5>
            <p className="text-neutral-400">@{user?.username}</p>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="flex flex-col gap-6">
        <p className="break-words">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          sed at incidunt, odio earum voluptates ipsa cupiditate nihil pariatur
          voluptatum in dolorem, tempore aliquam quia et provident dolorum.
          Iure, dolorum?
        </p>
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-6">
            <button type="button">
              <IconHeart className="size-5" />
            </button>
            <button type="button">
              <IconMessage className="size-5" />
            </button>
            <button type="button">
              <IconForward className="size-5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <IconClock className="size-5 text-neutral-400" />
              <span className="text-muted-foreground text-sm text-neutral-400">
                2h ago
              </span>
            </div>
          </div>
        </div>
        <Separator />
      </Card.Content>
      <Card.Footer>
        <PostComments />
      </Card.Footer>
    </Card>
  )
}
