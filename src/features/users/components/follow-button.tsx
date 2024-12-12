'use client'

import { Button, Form, TextField } from '@/components/ui'
import { followAction } from '@/features/users/action/follow-action'
import { followFormSchema } from '@/features/users/type/schema/follow-form-schema'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconMinus, IconPlus } from 'justd-icons'
import { useActionState, useOptimistic } from 'react'

type FollowButtonProps = {
  isFollowing: boolean
  userId: string
  isSuggestion?: boolean
}

export const FollowButton = ({
  isFollowing,
  userId,
  isSuggestion,
}: FollowButtonProps) => {
  const [optimisticIsFollowing, setOptimisticIsFollowing] = useOptimistic<
    boolean,
    void
  >(isFollowing, (currentState) => !currentState)

  const [lastResult, action] = useActionState(followAction, null)

  const [form, fields] = useForm({
    constraint: getZodConstraint(followFormSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: followFormSchema })
    },
    onSubmit() {
      setOptimisticIsFollowing()
    },
    defaultValue: {
      userId,
    },
  })

  if (isSuggestion) {
    return (
      <Form {...getFormProps(form)} action={action}>
        <TextField {...getInputProps(fields.userId, { type: 'hidden' })} />
        <Button
          type="submit"
          size="square-petite"
          appearance="outline"
          className="ml-auto"
        >
          {optimisticIsFollowing ? (
            <IconMinus className="size-4 ml-2" />
          ) : (
            <IconPlus className="size-4 ml-2" />
          )}{' '}
        </Button>
      </Form>
    )
  }

  return (
    <Form {...getFormProps(form)} action={action}>
      <TextField {...getInputProps(fields.userId, { type: 'hidden' })} />
      <Button
        type="submit"
        className="w-full"
        intent={optimisticIsFollowing ? 'secondary' : 'primary'}
        appearance={optimisticIsFollowing ? 'outline' : 'solid'}
      >
        {optimisticIsFollowing ? 'Unfollow' : 'Follow'}
        {optimisticIsFollowing ? (
          <IconMinus className="size-4 ml-2" />
        ) : (
          <IconPlus className="size-4 ml-2" />
        )}
      </Button>
    </Form>
  )
}
