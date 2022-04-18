import { ZodSchema } from 'zod'
import { RequestHandler } from 'express'

export const validateZod = (schema: ZodSchema<any>): RequestHandler => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body)
            next()
        } catch (e) {
            res.status(400).json({ error: 'Validation failed' })
        }
    }
}
