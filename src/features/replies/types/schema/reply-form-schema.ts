import { z } from 'zod'

export const replyFormSchema = z.object({
  // biome-ignore lint/style/useNamingConvention: This needs a snake_case name
  postId: z.string({ required_error: 'Post Id is required' }),
  content: z
    // biome-ignore lint/style/useNamingConvention: This needs a snake_case name
    .string({ required_error: 'Content is required' })
    .min(1)
    .max(300),
})

export type ReplyFormSchemaType = z.infer<typeof replyFormSchema>
