import { Button, Form, Loader, Modal, TextField } from '@/components/ui'
import { editPost } from '@/features/posts/actions/edit-post-action'
import { postEditFormSchema } from '@/features/posts/types/schema/post-edit-form-schema'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconSend } from 'justd-icons'
import { useActionState, useEffect } from 'react'

type PostEditModalProps = {
  postId: string
  content: string
  isOpen: boolean
  onClose: () => void
}

export const PostEditModal = ({
  postId,
  content,
  isOpen,
  onClose,
}: PostEditModalProps) => {
  const [lastResult, action, isPending] = useActionState(editPost, null)

  const [form, fields] = useForm({
    constraint: getZodConstraint(postEditFormSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: postEditFormSchema })
    },

    defaultValue: {
      postId,
      content,
    },
  })

  useEffect(() => {
    if (lastResult?.status === 'success') {
      onClose()
    }
  }, [lastResult, onClose])

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Form {...getFormProps(form)} action={action}>
          <TextField {...getInputProps(fields.postId, { type: 'hidden' })} />
          <TextField
            {...getInputProps(fields.content, { type: 'text' })}
            placeholder="What's on your mind?"
            isDisabled={isPending}
            className="w-full"
            errorMessage={''}
          />
          <span
            id={fields.content.errorId}
            className="mt-1 text-sm text-red-500"
          >
            {fields.content.errors}
          </span>
          <Modal.Footer>
            <Modal.Close isDisabled={isPending}>Cancel</Modal.Close>
            <Button
              type="submit"
              size="square-petite"
              appearance="outline"
              className={'h-10'}
              isDisabled={isPending || fields.content.value === undefined}
            >
              {isPending ? <Loader /> : <IconSend />}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Content>
    </Modal>
  )
}
