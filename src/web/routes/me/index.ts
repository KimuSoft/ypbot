import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth'
import { userToJson } from '../../utils/userToJson'

const router = Router()

router.get('/', requireAuth, (req, res) => {
    const user = req.user!

    res.json(userToJson(user))
})

export default router
