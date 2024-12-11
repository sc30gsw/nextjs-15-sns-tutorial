import { Avatar } from '@/components/ui'
import { IconHeart } from 'justd-icons'

export const PostComments = () => {
  return (
    <div className="flex w-full gap-4 items-center">
      <Avatar src={'placeholder.png'} alt="avatar" initials="A" />
      <div className="flex justify-between items-center w-full">
        <div>
          <p className="text-lg">name</p>
          <p className="text-neutral-400 text-base">comments</p>
        </div>
        <button type="button">
          <IconHeart className="size-5" />
        </button>
      </div>
    </div>
  )
}
