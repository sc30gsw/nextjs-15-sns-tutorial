import { Button, Form, SearchField } from '@/components/ui'
import { searchPost } from '@/features/posts/actions/search-post-action'
import { postSearchFormSchema } from '@/features/posts/types/schema/post-search-form-schema'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { usePathname, useRouter } from 'next/navigation'
import { parseAsString, useQueryStates } from 'nuqs'
import { useActionState, useEffect } from 'react'

export const PostSearchForm = () => {
  const [conditions, setConditions] = useQueryStates(
    {
      content: parseAsString.withDefault(''),
    },
    {
      history: 'push',
      shallow: true,
    },
  )

  const pathname = usePathname()
  const router = useRouter()

  const [lastResult, action, isPending] = useActionState(searchPost, null)

  const [form, fields] = useForm({
    constraint: getZodConstraint(postSearchFormSchema),
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: postSearchFormSchema })
    },
    onSubmit(_, { formData }) {
      setConditions({
        content: formData.get('content') as string,
      })
    },
    defaultValue: {
      content: conditions.content ?? '',
    },
  })

  useEffect(() => {
    if (lastResult?.status === 'success') {
      router.refresh()
    }
  }, [lastResult, router])

  return (
    <Form
      {...getFormProps(form)}
      action={(formData) => {
        formData.set('pathname', pathname)

        action(formData)
      }}
      className="flex items-center"
    >
      <SearchField
        {...getInputProps(fields.content, { type: 'text' })}
        className="sm:inline hidden sm:ml-1.5"
      />
      <Button type="submit" className="hidden" isPending={isPending} />
    </Form>
  )
}
