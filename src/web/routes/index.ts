import { Router } from 'express'
import me from './me'
import guilds from './guilds'
import rules from './rules'

const router = Router()

router.use('/me', me)

router.use('/guilds/:id', guilds)

router.use('/rules', rules)

export default router
