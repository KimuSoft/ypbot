import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth'
import db from '../../../utils/db'
import { safe } from '../../utils/safeHandler'
import { validateZod } from '../../utils/zod'
import { ruleCreateSchema } from '../../validation/rules'

const router = Router()

router.use(requireAuth)

router.get(
    '/me',
    safe(async (req, res) => {
        const user = req.user!
        res.json(await db.rule.findMany({ where: { authorId: user.yp.id } }))
    })
)

router.post(
    '/',
    validateZod(ruleCreateSchema),
    safe(async (req, res) => {
        const item = await db.rule.create({
            data: {
                authorId: req.user!.yp.id,
                name: req.body.name,
                description: req.body.name,
            },
            select: {
                id: true,
            },
        })
        res.json({ id: item.id })
    })
)

export default router
