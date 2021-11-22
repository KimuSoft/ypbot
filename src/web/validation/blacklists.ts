import { z } from 'zod'

export const blacklistCreateSchema = z.object({
    name: z.string(),
})
