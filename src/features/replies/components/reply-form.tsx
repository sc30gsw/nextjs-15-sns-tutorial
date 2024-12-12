'use client'

import { Avatar, Button, Form, Loader, TextField } from '@/components/ui'
import { addReply } from '@/features/replies/actions/add-reply'
import { replyFormSchema } from '@/features/replies/types/schema/reply-form-schema'
import { useUser } from '@clerk/nextjs'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconSend } from 'justd-icons'
import { useParams } from 'next/navigation'
import { useActionState } from 'react'

export const ReplyForm = () => {
  const [lastResult, action, isPending] = useActionState(addReply, null)
  const params = useParams()

  const { user } = useUser()

  const [form, fields] = useForm({
    constraint: getZodConstraint(replyFormSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: replyFormSchema })
    },
    defaultValue: {
      postId: params.postId as string,
      content: '',
    },
  })

  return (
    <Form
      {...getFormProps(form)}
      action={action}
      className="w-full flex justify-between items-center gap-4 mt-4"
    >
      <Avatar
        src={user?.imageUrl ?? 'placeholder.png'}
        alt="item avatar"
        initials="PA"
      />
      <div className="w-full flex flex-col gap-1">
        <TextField {...getInputProps(fields.postId, { type: 'hidden' })} />
        <TextField
          {...getInputProps(fields.content, { type: 'text' })}
          placeholder="Reply on this post..."
          isDisabled={isPending}
          className="w-full"
          errorMessage={''}
        />
        <span id={fields.content.errorId} className="mt-1 text-sm text-red-500">
          {fields.content.errors}
        </span>
      </div>
      <Button
        type="submit"
        size="square-petite"
        appearance="outline"
        className={'h-10'}
        isDisabled={isPending || fields.content.value === undefined}
      >
        {isPending ? <Loader /> : <IconSend />}
      </Button>
    </Form>
  )
}
