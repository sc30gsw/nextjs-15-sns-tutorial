import { z } from 'zod'

export const postSearchFormSchema = z.object({
  content: z.string().max(300).optional(),
})

export type PostSearchFormSchemaType = z.infer<typeof postSearchFormSchema>
