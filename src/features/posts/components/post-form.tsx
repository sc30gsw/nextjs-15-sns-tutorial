'use client'

import { Button, Form, TextField } from '@/components/ui'
import { IconSend } from 'justd-icons'

export const PostForm = () => {
  return (
    <Form className="w-full flex items-center justify-between gap-4">
      <TextField placeholder="What's on your mind?" className="w-full" />
      <Button size="square-petite" appearance="outline" className={'h-full'}>
        <IconSend />
      </Button>
    </Form>
  )
}
