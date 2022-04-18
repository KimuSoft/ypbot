import { RequestHandler } from 'express'

export const safe = (handler: RequestHandler): RequestHandler => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next)
        } catch (e: any) {
            res.status(500).json({ error: e.message })
        }
    }
}
