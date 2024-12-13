import { Form, TextField } from '@/components/ui'
import { likeFormSchema } from '@/features/likes/types/schema/like-form-schema'
import { replyLikeAction } from '@/features/replies/actions/reply-like-action'
import { useUser } from '@clerk/nextjs'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconHeart, IconHeartFill } from 'justd-icons'
import { useActionState, useOptimistic } from 'react'

type ReplyLikeButtonProps = {
  replyId: string
  initialLikes: string[]
}

export const ReplyLikeButton = ({
  replyId,
  initialLikes,
}: ReplyLikeButtonProps) => {
  const { user } = useUser()

  const [optimisticLike, setOptimisticLike] = useOptimistic<
    { likeCount: number; isLiked: boolean },
    void
  >(
    {
      likeCount: initialLikes.length,
      isLiked: user?.id ? initialLikes.includes(user.id) : false,
    },
    (currentState) => ({
      likeCount: currentState.isLiked
        ? currentState.likeCount - 1
        : currentState.likeCount + 1,
      isLiked: !currentState.isLiked,
    }),
  )

  const [lastResult, action] = useActionState(replyLikeAction, null)

  const [form, fields] = useForm({
    constraint: getZodConstraint(likeFormSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: likeFormSchema })
    },
    onSubmit() {
      setOptimisticLike()
    },
    defaultValue: {
      postId: replyId,
    },
  })

  return (
    <Form
      {...getFormProps(form)}
      action={action}
      className="flex items-center gap-1"
    >
      <TextField {...getInputProps(fields.postId, { type: 'hidden' })} />
      <button type="submit" className="flex items-center gap-2">
        {optimisticLike.isLiked ? (
          <IconHeartFill className="size-5 text-red-500" />
        ) : (
          <IconHeart className="size-5" />
        )}
      </button>
      <span className={optimisticLike.isLiked ? 'text-red-500' : ''}>
        {optimisticLike.likeCount}
      </span>
    </Form>
  )
}
