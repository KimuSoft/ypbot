import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get(
    '/login',
    passport.authenticate('discord', {
        successRedirect: '/',
        failureRedirect: '/',
    })
)

export default router
