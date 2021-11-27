import { z } from 'zod'

export const blacklistCreateSchema = z.object({
    name: z.string(),
})

export const blacklistEditSchema = z.object({
    name: z.string().min(1),
    words: z.array(z.string()),
    channels: z.array(z.string()),
})
