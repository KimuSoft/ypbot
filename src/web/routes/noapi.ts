import { Router } from 'express'
import auth from './auth'
import invite from './invite'

const router = Router()

router.use('/auth', auth)

router.use('/invite', invite)

export default router
