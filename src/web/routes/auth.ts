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

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

export default router
