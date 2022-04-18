import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth'
import db from '../../../utils/db'
import { safe } from '../../utils/safeHandler'

const router = Router()

router.use(requireAuth)

router.get(
    '/me',
    safe(async (req, res) => {
        const user = req.user!
        res.json(await db.rule.findMany({ where: { authorId: user.yp.id } }))
    })
)

export default router
