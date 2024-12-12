'use client'

import { Button, Form, TextField } from '@/components/ui'
import { followAction } from '@/features/users/action/follow-action'
import { followFormSchema } from '@/features/users/type/schema/follow-form-schema'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconMinus, IconPlus } from 'justd-icons'
import { useActionState } from 'react'

type FollowButtonProps = {
  isFollowing: boolean
  userId: string
}

export const FollowButton = ({ isFollowing, userId }: FollowButtonProps) => {
  const [lastResult, action, isPending] = useActionState(followAction, null)

  const [form, fields] = useForm({
    constraint: getZodConstraint(followFormSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: followFormSchema })
    },
    // onSubmit() {
    //   setOptimisticLike()
    // },
    defaultValue: {
      userId,
    },
  })
  return (
    <Form {...getFormProps(form)} action={action}>
      <TextField {...getInputProps(fields.userId, { type: 'hidden' })} />
      {isPending ? (
        <Button
          type="submit"
          isDisabled={true}
          appearance="outline"
          className="w-full"
        >
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </Button>
      ) : (
        <Button
          type="submit"
          className="w-full"
          intent={isFollowing ? 'secondary' : 'primary'}
          appearance={isFollowing ? 'outline' : 'solid'}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
          {isFollowing ? (
            <IconMinus className="size-4 ml-2" />
          ) : (
            <IconPlus className="size-4 ml-2" />
          )}
        </Button>
      )}
    </Form>
  )
}
