import express from 'express'

import routes from './routes'

import session from 'express-session'
import { config } from '../config'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import db from '../utils/db'
import passport from 'passport'
import DiscordStrategy from 'passport-discord'
import { cts } from '../index'
import * as path from 'path'
import noapi from './routes/noapi'

passport.use(
    new DiscordStrategy(
        {
            clientID: config.discord.client.id,
            clientSecret: config.discord.client.secret,
            callbackURL: config.discord.client.callback,
            scope: ['identify', 'guilds'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await db.user.upsert({
                    where: {
                        id: profile.id,
                    },
                    create: {
                        id: profile.id,
                        discordAccessToken: accessToken,
                        discordRefreshToken: refreshToken,
                    },
                    update: {
                        discordAccessToken: accessToken,
                        discordRefreshToken: refreshToken,
                    },
                })

                const discordUser = await cts.client.users.fetch(profile.id, { cache: true })

                done(null, {
                    discord: discordUser,
                    yp: user,
                })
            } catch (e: any) {
                done(e)
            }
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.yp.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.user.findFirst({
            where: {
                id: id as string,
            },
        })

        if (!user) {
            return done(null)
        }

        const discordUser = await cts.client.users.fetch(user.id, { cache: true })

        done(null, {
            discord: discordUser,
            yp: user,
        })
    } catch (e: any) {
        done(e)
    }
})

const app = express()

app.use(express.json())

app.set('view engine', 'pug')

app.set('views', path.join(__dirname, '../../views'))

app.use(
    session({
        secret: config.web.sessionSecret,
        saveUninitialized: true,
        resave: true,
        // @ts-ignore
        store: new PrismaSessionStore(db, {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
)

app.use(passport.initialize())

app.use(passport.session())

app.use('/assets', express.static(path.join(__dirname, '../../web/dist')))
app.use('/lang', express.static(path.join(__dirname, '../../lang')))

app.use(noapi)

app.use((req, res, next) => {
    if (req.headers['x-yp-api'] === 'true') {
        return next()
    }
    return res.render('app')
})

app.use(routes)

export default app
