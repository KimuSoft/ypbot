import { Router } from 'express'
import me from './me'

const router = Router()

router.use('/me', me)

export default router
