import { Router } from 'express'
import me from './me'
import guild from './guild'

const router = Router()

router.use('/me', me)

router.use('/guilds/:id', guild)

export default router
