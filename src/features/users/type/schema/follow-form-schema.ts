import { z } from 'zod'

export const followFormSchema = z.object({
  // biome-ignore lint/style/useNamingConvention: This needs a snake_case name
  userId: z.string({ required_error: 'User Id is required' }),
})

export type FollowFormSchema = z.infer<typeof followFormSchema>
