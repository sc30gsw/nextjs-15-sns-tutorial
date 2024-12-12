'use client'

import { Form, TextField } from '@/components/ui'
import { likeAction } from '@/features/likes/action/like-action'
import { likeFormSchema } from '@/features/likes/types/schema/like-form-schema'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconHeart } from 'justd-icons'
import { useActionState } from 'react'

type LikeButtonProps = {
  postId: string
  initialLikes: string[]
}

export const LikeButton = ({ postId, initialLikes }: LikeButtonProps) => {
  const [lastResult, action, isPending] = useActionState(likeAction, null)

  const [form, fields] = useForm({
    constraint: getZodConstraint(likeFormSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: likeFormSchema })
    },
    defaultValue: {
      postId,
    },
  })

  return (
    <Form {...getFormProps(form)} action={action}>
      <TextField {...getInputProps(fields.postId, { type: 'hidden' })} />
      <button
        type="submit"
        className="flex items-center gap-2"
        disabled={isPending}
      >
        <IconHeart className="size-5" />
        <span>{initialLikes.length}</span>
      </button>
    </Form>
  )
}
