import { RequestHandler } from 'express'

export const requireAuth: RequestHandler = (req, res, next) => {
    if (req.user) {
        return next()
    }
    res.status(401).json({ error: 'Unauthorized' })
}
