import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  tag: z.string().regex(/^.{1,}#[0-9]{4}$/),
  avatar: z.string().url(),
})
