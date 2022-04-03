import { Router } from 'express'
import me from './me'
import guilds from './guilds'

const router = Router()

router.use('/me', me)

router.use('/guilds/:id', guilds)

export default router
